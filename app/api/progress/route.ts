import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface Lesson {
  concepts: string[]
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      console.log('No session or user ID found')
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { lessonId, conversationHistory, isCompleted } = await request.json()
    console.log('Progress POST request:', { 
      lessonId, 
      isCompleted, 
      userId: session.user.id,
      conversationHistoryLength: conversationHistory?.length,
      rawIsCompleted: isCompleted,
      isCompletedType: typeof isCompleted
    })

    // Validate input data
    if (!lessonId || !Array.isArray(conversationHistory)) {
      console.error('Invalid input:', { lessonId, conversationHistory })
      return new NextResponse('Invalid input data', { status: 400 })
    }

    // First, get the curriculum to check if this lesson is part of it
    const curriculum = await prisma.curriculum.findFirst({
      where: {
        userId: session.user.id,
        status: 'ACTIVE'
      }
    })

    if (!curriculum) {
      console.log('No active curriculum found for user:', session.user.id)
      return new NextResponse('No active curriculum found', { status: 404 })
    }

    try {
      // Update or create progress
      const progress = await prisma.progress.upsert({
        where: {
          userId_lessonId: {
            userId: session.user.id,
            lessonId: lessonId
          }
        },
        update: {
          conversationHistory: conversationHistory,
          isCompleted: isCompleted === true, // Ensure boolean
          lastQuestionIndex: conversationHistory.length
        },
        create: {
          userId: session.user.id,
          lessonId: lessonId,
          conversationHistory: conversationHistory,
          isCompleted: isCompleted === true, // Ensure boolean
          lastQuestionIndex: conversationHistory.length
        }
      })

      console.log('Progress saved successfully:', { 
        id: progress.id,
        lessonId: progress.lessonId,
        isCompleted: progress.isCompleted,
        lastQuestionIndex: progress.lastQuestionIndex
      })

      return NextResponse.json(progress)
    } catch (dbError: any) {
      console.error('Database error:', {
        error: dbError,
        message: dbError.message,
        code: dbError.code,
        meta: dbError.meta,
        stack: dbError.stack
      })
      throw dbError // Re-throw to be caught by outer catch
    }
  } catch (error: any) {
    console.error('Error saving progress:', error)
    console.error('Error details:', {
      errorMessage: error?.message,
      errorCode: error?.code,
      errorMeta: error?.meta,
      errorStack: error?.stack
    })
    return new NextResponse(
      JSON.stringify({ 
        message: 'Internal Server Error', 
        error: error?.message || 'Unknown error',
        code: error?.code,
        meta: error?.meta
      }),
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const lessonId = searchParams.get('lessonId')

    if (!lessonId) {
      return new NextResponse('Lesson ID is required', { status: 400 })
    }

    try {
      const progress = await prisma.progress.findUnique({
        where: {
          userId_lessonId: {
            userId: session.user.id,
            lessonId: lessonId
          }
        }
      })

      console.log('Progress GET:', {
        userId: session.user.id,
        lessonId,
        isCompleted: progress?.isCompleted,
        found: !!progress
      })

      return NextResponse.json(progress || {
        isCompleted: false,
        lastQuestionIndex: 0,
        conversationHistory: []
      })
    } catch (dbError: any) {
      console.error('Database error:', {
        error: dbError,
        message: dbError.message,
        code: dbError.code,
        meta: dbError.meta,
        stack: dbError.stack
      })
      throw dbError // Re-throw to be caught by outer catch
    }
  } catch (error: any) {
    console.error('Error fetching progress:', error)
    console.error('Error details:', {
      errorMessage: error?.message,
      errorCode: error?.code,
      errorMeta: error?.meta,
      errorStack: error?.stack
    })
    return new NextResponse(
      JSON.stringify({ 
        message: 'Internal Server Error', 
        error: error?.message || 'Unknown error',
        code: error?.code,
        meta: error?.meta
      }),
      { status: 500 }
    )
  }
} 