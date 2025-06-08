import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { GoogleGenerativeAI } from '@google/generative-ai'

interface ConversationItem {
  text: string
  userAnswer: string
  feedback: string
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { questionId, userAnswer, lessonId, conversationHistory, currentQuestion } = await request.json()

    // Generate feedback using Gemini AI
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `Give feedback on this student answer about "${lessonId}":
    
    Question: ${currentQuestion.text}
    Their answer: "${userAnswer}"
    
    Give helpful feedback in 2-3 sentences. Point out what they got right and gently guide them if they missed something. Be encouraging and use simple language.
    
    Return JSON only: {"feedback": "your feedback here"}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Clean the response text by removing any markdown formatting
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim()
    
    try {
      // Parse the JSON response
      const feedbackData = JSON.parse(cleanedText)
      
      if (!feedbackData.feedback || typeof feedbackData.feedback !== 'string') {
        throw new Error('Invalid response format')
      }

      return NextResponse.json(feedbackData)
    } catch (error) {
      return new NextResponse('Error processing response', { status: 500 })
    }
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 