import connectToDB from "@/lib/mongodb";
import WasteEntry from "@/lib/models/WasteEntry";
import User from "@/lib/models/User";
import cloudinary from "@/lib/cloudinary";

export const config = {
  api: {
    bodyParser: false,
    sizeLimit:'10mb'
  },
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const lat = formData.get("lat");
    const lng = formData.get("lng");
    const file = formData.get("image");
    const clerkUserId = formData.get("userId"); // Clerk ID like "user_2van..."

    if (!lat || !lng || !file || !clerkUserId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    await connectToDB();

    // Find the user in MongoDB using clerkId
    const dbUser = await User.findOne({ clerkId: clerkUserId });
    if (!dbUser) {
      return new Response(
        JSON.stringify({ error: "User not found in database" }),
        { status: 404 }
      );
    }

    // Convert Blob to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload image to Cloudinary
    const uploaded = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "waste_images" }, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        })
        .end(buffer);
    });

    // Gemini analysis
    const geminiRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/gemini-analyze`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: uploaded.secure_url,
          prompt: `
          ONLY RETURN JSON NO DESCRIPTION
          Analyze this waste image and return a JSON object with keys:
          wasteType ("plastic", "organic", "metal", "e-waste", or "other"), 
          confidence (a number between 0 and 1), 
          amount ("low", "medium", or "high"), 
          and points (5 for low, 10 for medium, 15 for high).
        `,
        }),
      }
    );

    const { analysis } = await geminiRes.json();

    let parsed;
    try {
      const cleaned = analysis.trim().replace(/^```json|```$/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("[GEMINI_PARSE_ERROR]", analysis);
      return new Response(
        JSON.stringify({ error: "Gemini returned invalid JSON" }),
        { status: 500 }
      );
    }

    // Map amount string to numeric value
    const amountMap = { low: 1, medium: 2, high: 3 };
    const numericAmount = amountMap[parsed.amount.toLowerCase()] ?? 1;

    // Create WasteEntry
    const newEntry = new WasteEntry({
      imageURL: uploaded.secure_url,
      location: {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)],
      },

      wasteType: parsed.wasteType,
      confidence: Math.round(parsed.confidence * 100), // Scale 0-1 to 0-100
      amount: numericAmount,
      userId: dbUser._id,
      points: parsed.points,
      createdAt: new Date(),
    });
    
    await newEntry.save();

    // Update user points
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/update-user-points`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: clerkUserId,
        points: parsed.points,
      }),
    });

    return new Response(JSON.stringify({ message: "Reported successfully!" }), {
      status: 200,
    });
  } catch (err) {
    console.error("[REPORT_API_ERROR]", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal Server Error" }),
      { status: 500 }
    );
  }
}
