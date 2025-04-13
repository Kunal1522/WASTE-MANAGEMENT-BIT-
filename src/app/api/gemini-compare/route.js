export const config = {
    api: {
      bodyParser: {
        sizeLimit: '10mb',
      },
    },
  };
  
  export async function POST(req) {
    try {
      const { imageUrl1, imageUrl2 } = await req.json();
  
      if (!imageUrl1 || !imageUrl2) {
        return new Response(JSON.stringify({ error: 'Both image URLs are required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
  
      // Helper to fetch image and convert to base64
      const fetchImageBase64 = async (url) => {
        const res = await fetch(url);
        const blob = await res.blob();
        const arrayBuffer = await blob.arrayBuffer();
        return {
          base64: Buffer.from(arrayBuffer).toString('base64'),
          mimeType: blob.type
        };
      };
  
      const [img1, img2] = await Promise.all([
        fetchImageBase64(imageUrl1),
        fetchImageBase64(imageUrl2)
      ]);
  
      const prompt = `
  These are two images of waste. Carefully analyze them and determine if they show the same type of waste, captured at different times or angles.
  Focus on the type of material (e.g., plastic bottle, metal can), shape, color, and quantity.
  Answer with a single word: "true" (if same) or "false" (if different).
  `;
  
      // Call Gemini
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { inlineData: { mimeType: img1.mimeType, data: img1.base64 } },
                { inlineData: { mimeType: img2.mimeType, data: img2.base64 } },
                { text: prompt }
              ]
            }]
          })
        }
      );
  
      const geminiData = await geminiRes.json();
      const reply = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.toLowerCase().trim();
  
      const sameWaste = reply === 'true';
  
      return new Response(JSON.stringify({ sameWaste }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
  
    } catch (err) {
      console.error('[GEMINI_COMPARE_ERROR]', err);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  