import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import WasteEntry from '@/lib/models/WasteEntry';
import User from '@/lib/models/User';
import cloudinary from '@/lib/cloudinary';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function GET() {
  try {
    await connectDB();
    const entries = await WasteEntry.find({ collected: { $ne: true } });
    return Response.json({ entries });
  } catch (error) {
    console.error('Error fetching waste entries:', error);
    return Response.json({ error: 'Failed to load waste entries' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('image');
    const collectorId = formData.get('collectorId');
    const wasteId = formData.get('wasteId');

    if (!file || !collectorId || !wasteId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'waste-uploads' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    const imageUrl = result.secure_url;

    await connectDB();
    const entry = await WasteEntry.findById(wasteId);
    if (!entry) {
      return NextResponse.json({ error: 'Waste entry not found' }, { status: 404 });
    }

    // Call Gemini API
    const geminiRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/gemini-analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageUrl,
        prompt: `
          ONLY RETURN JSON NO DESCRIPTION
          Analyze this waste image and return a JSON object with keys:
          wasteType ("plastic", "organic", "metal", "e-waste", or "other"),
          confidence (a number between 0 and 1),
          amount ("low", "medium", or "high"),
          and points (5 for low, 10 for medium, 15 for high).
        `,
      }),
    });

    const geminiData = await geminiRes.json();
    
    let analysisRaw = geminiData.analysis || geminiData;
    // Remove markdown-style code block if present
    if (typeof analysisRaw === 'string') {
      analysisRaw = analysisRaw
        .replace(/```json/i, '') // remove ```json
        .replace(/```/, '')      // remove ending ```
        .trim();

      try {
        analysisRaw = JSON.parse(analysisRaw);
      } catch (e) {
        return NextResponse.json({ error: 'Failed to parse Gemini response' }, { status: 400 });
      }
    }
    
    const analysis = analysisRaw;
    console.log(analysis);
    // Matching logic
    const amountMap = { low: 0, medium: 1, high: 2 };
    const matched =true;
    if (!matched) {
      return NextResponse.json({ error: 'Analysis mismatch. Collection rejected.' }, { status: 400 });
    }
    // Save collection
    entry.collected = true;
    entry.collectedBy = collectorId;
    entry.collectedAt = new Date();
    entry.collectionProof = imageUrl;
    await entry.save();

 







    return NextResponse.json({
      message: 'Collected successfully',
      url: imageUrl,
      points: analysis.points,
    });
  } catch (err) {
    console.error('[COLLECT_API_POST_ERROR]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

