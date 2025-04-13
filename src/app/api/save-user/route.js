  import { NextResponse } from 'next/server'
  import connectDB from '@/lib/mongodb'
  import User from '@/lib/models/User'

  export async function POST(req) {
    await connectDB()
    const body = await req.json()
    const { clerkId, name, email } = body

    if (!clerkId || !name || !email) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 })
    }
    try {
      const existingUser = await User.findOne({ clerkId })
      if (existingUser) {
        return NextResponse.json({ message: 'User already exists', user: existingUser })
      }
      const newUser = await User.create({ clerkId, name, email })
      return NextResponse.json({ message: 'User created', user: newUser })
    } catch (err) {
      console.error(err)
      return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
  }
