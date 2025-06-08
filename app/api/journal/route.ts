import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json([], { status: 401 })
  }
  const journals = await prisma.journalEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      reflection: true,
      summary: true,
      createdAt: true
    }
  })
  return NextResponse.json(journals)
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { reflection, day } = await req.json()

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
    
    const prompt = `Summarize this learning reflection in a helpful way. Keep it concise and highlight the main insights:

${reflection}`

    const result = await model.generateContent(prompt)
    const summary = result.response.text()

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