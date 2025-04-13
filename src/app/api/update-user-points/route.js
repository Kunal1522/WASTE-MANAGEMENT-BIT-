import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(req) {
  try {
    const { userId, points } = await req.json(); // userId here is actually the Clerk ID

    if (!userId || typeof points !== 'number') {
      return new Response(JSON.stringify({ error: 'userId (Clerk ID) and points are required' }), {
        status: 400,
      });
    }

    await connectDB();

    const updatedUser = await User.findOneAndUpdate(
      { clerkId: userId },
      {
        $inc: { totalPoints: points },
        $set: { updatedAt: new Date() },
      },
      { new: true }
    );

    if (!updatedUser) {
      return new Response(JSON.stringify({ error: 'User not found in database' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: 'Points updated', user: updatedUser }), {
      status: 200,
    });
  } catch (err) {
    console.error('[UPDATE_USER_POINTS_ERROR]', err);
    return new Response(JSON.stringify({ error: 'Failed to update user points' }), {
      status: 500,
    });
  }
}
