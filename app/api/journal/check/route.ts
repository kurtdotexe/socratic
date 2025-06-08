import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const day = parseInt(searchParams.get('day') || '0')

    if (!day) {
      return NextResponse.json({ error: 'Day parameter is required' }, { status: 400 })
    }

    const existingEntry = await prisma.journalEntry.findFirst({
      where: {
        userId: session.user.id,
        day: day
      }
    })

    return NextResponse.json({ exists: !!existingEntry })
  } catch (error) {
    console.error('Error checking journal entry:', error)
    return NextResponse.json(
      { error: 'Failed to check journal entry' },
      { status: 500 }
    )
  }
} 