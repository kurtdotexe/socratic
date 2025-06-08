import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { topic, days } = await request.json()

    if (!topic || !days || days < 1 || days > 90) {
      return NextResponse.json(
        { error: 'Invalid topic or days (must be 1-90)' },
        { status: 400 }
      )
    }

    const existingCurriculum = await prisma.curriculum.findFirst({
      where: {
        userId: session.user.id,
        status: 'ACTIVE'
      }
    })

    if (existingCurriculum) {
      await prisma.curriculum.update({
        where: { id: existingCurriculum.id },
        data: { status: 'INACTIVE' }
      })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `Create a ${days}-day learning curriculum for the topic: ${topic}

Please respond with ONLY a JSON object in this exact format:
{
  "lessons": [
    {
      "day": 1,
      "concepts": ["concept1", "concept2", "concept3"]
    },
    {
      "day": 2,
      "concepts": ["concept4", "concept5", "concept6"]
    }
  ]
}

Guidelines:
- Each day should have 3-5 specific concepts/subtopics
- Concepts should be clear, specific learning objectives
- Progress logically from basic to advanced concepts
- Make concepts practical and actionable
- Each concept should be learnable in a focused session

Do not include any explanation, just return the JSON.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    let lessonsData
    try {
      lessonsData = JSON.parse(text)
    } catch (parseError) {
      console.error('Failed to parse AI response:', text)
      return NextResponse.json(
        { error: 'Failed to generate curriculum' },
        { status: 500 }
      )
    }

    const curriculum = await prisma.curriculum.create({
      data: {
        topic,
        days,
        userId: session.user.id,
        lessons: lessonsData.lessons,
        status: 'ACTIVE'
      }
    })

    return NextResponse.json(curriculum)

  } catch (error) {
    console.error('Error creating curriculum:', error)
    return NextResponse.json(
      { error: 'Failed to create curriculum' },
      { status: 500 }
    )
  }
}