import { NextRequest, NextResponse } from 'next/server'
import { redis } from '../../../../lib/redis'

const BALANCE_KEY = 'user:balance'
const MAX_GIFT_PRICE_KEY = 'user:maxGiftPrice'

export async function GET() {
  try {
    const balance = await redis.get(BALANCE_KEY) || 250.75
    const maxGiftPrice = await redis.get(MAX_GIFT_PRICE_KEY) || 100
    
    return NextResponse.json({
      balance: Number(balance),
      maxGiftPrice: Number(maxGiftPrice)
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { balance, maxGiftPrice } = body
    
    if (balance !== undefined) {
      await redis.set(BALANCE_KEY, balance)
    }
    
    if (maxGiftPrice !== undefined) {
      await redis.set(MAX_GIFT_PRICE_KEY, maxGiftPrice)
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
