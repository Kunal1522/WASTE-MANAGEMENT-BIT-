import connectDB from '@/lib/mongodb';
import WasteEntry from '@/lib/models/WasteEntry';

export async function POST(req) {
  try {
    const { wasteId } = await req.json();

    if (!wasteId) {
      return new Response(JSON.stringify({ error: 'wasteId is required' }), {
        status: 400,
      });
    }
    await connectDB();
    const updatedWaste = await WasteEntry.findByIdAndUpdate(
      wasteId,
      { collected: true },
      { new: true }
    );

    if (!updatedWaste) {
      return new Response(JSON.stringify({ error: 'Waste entry not found' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: 'Waste marked as collected', waste: updatedWaste }), {
      status: 200,
    });
  } catch (err) {
    console.error('[MARK_COLLECTED_ERROR]', err);
    return new Response(JSON.stringify({ error: 'Failed to mark waste as collected' }), {
      status: 500,
    });
  }
}
