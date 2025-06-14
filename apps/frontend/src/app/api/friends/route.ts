import { NextRequest, NextResponse } from 'next/server'
import { redis } from '../../../../lib/redis'

export interface Friend {
  id: string;
  name: string;
  birthday: string;
  conversationFile?: {
    name: string;
    size: number;
    type: string;
  };
  giftHistory: GiftHistoryItem[];
}

export interface GiftHistoryItem {
  id: string;
  date: string;
  description: string;
  price: number;
}

const FRIENDS_KEY = 'user:friends'

export async function GET() {
  try {
    const friends = await redis.get(FRIENDS_KEY)
    return NextResponse.json(friends || [])
  } catch (error) {
    console.error('Error fetching friends:', error)
    return NextResponse.json({ error: 'Failed to fetch friends' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, birthday, conversationFile } = body
    
    if (!name || !birthday) {
      return NextResponse.json({ error: 'Name and birthday are required' }, { status: 400 })
    }

    const friends = (await redis.get(FRIENDS_KEY)) || []
    const newFriend: Friend = {
      id: Date.now().toString(),
      name,
      birthday,
      conversationFile,
      giftHistory: [],
    }

    const updatedFriends = [...(friends as Friend[]), newFriend]
    await redis.set(FRIENDS_KEY, updatedFriends)
    
    return NextResponse.json(newFriend, { status: 201 })
  } catch (error) {
    console.error('Error adding friend:', error)
    return NextResponse.json({ error: 'Failed to add friend' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const friendId = searchParams.get('id')
    
    if (!friendId) {
      return NextResponse.json({ error: 'Friend ID is required' }, { status: 400 })
    }

    const friends = (await redis.get(FRIENDS_KEY)) || []
    const updatedFriends = (friends as Friend[]).filter(f => f.id !== friendId)
    await redis.set(FRIENDS_KEY, updatedFriends)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting friend:', error)
    return NextResponse.json({ error: 'Failed to delete friend' }, { status: 500 })
  }
}
