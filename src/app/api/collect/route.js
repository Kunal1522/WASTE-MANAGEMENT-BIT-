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

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'waste-uploads' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json({ imageUrl: result.secure_url }, { status: 200 });
  } catch (err) {
    console.error('[IMAGE_UPLOAD_ERROR]', err);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}