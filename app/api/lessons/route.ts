import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Find the active curriculum for the user
    const curriculum = await prisma.curriculum.findFirst({
      where: {
        userId: session.user.id,
        status: 'ACTIVE'
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (!curriculum) {
      return new NextResponse('No active curriculum found', { status: 404 })
    }

    // Return the lessons stored as JSON in the curriculum
    return NextResponse.json(curriculum.lessons)
  } catch (error) {
    console.error('Error fetching lessons:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
