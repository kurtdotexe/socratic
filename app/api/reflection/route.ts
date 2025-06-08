import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyDU80LxMU23G18HV7PZN8g2NzrQS8Fncic')

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { reflection, day } = await req.json()

    // Generate AI summary using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
    
    const prompt = `You are a helpful AI that summarizes learning reflections. Create a concise, insightful summary that captures the key learnings and insights. Format it in a journal-like style.

User's reflection:
${reflection}`

    const result = await model.generateContent(prompt)
    const summary = result.response.text()

    // Store in database
    const journalEntry = await prisma.journalEntry.create({
      data: {
        userId: session.user.id,
        day: day,
        reflection: reflection,
        summary: summary,
        createdAt: new Date()
      }
    })

    return NextResponse.json(journalEntry)
  } catch (error) {
    console.error('Error processing reflection:', error)
    return NextResponse.json(
      { error: 'Failed to process reflection' },
      { status: 500 }
    )
  }
} 