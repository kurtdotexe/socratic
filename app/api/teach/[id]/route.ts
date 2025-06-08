import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { GoogleGenerativeAI } from '@google/generative-ai'

interface ConversationItem {
  text: string
  userAnswer: string
  feedback: string
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Decode the lesson ID
    const lessonId = decodeURIComponent(params.id)

    // Generate initial Socratic question using Gemini AI
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `You are Socrates, but speak in simple, everyday language that anyone can understand.
    Start a conversation about: "${lessonId}"

    Ask a simple question that will help the student think about this topic.
    The question should:
    1. Use everyday words and short sentences
    2. Focus on one main idea
    3. Be easy to understand
    4. Make the student think, but not feel overwhelmed

    Return ONLY a raw JSON object (no markdown formatting, no code blocks) with this exact structure:
    {
      "question": {
        "id": 1,
        "text": "your question here"
      }
    }`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Clean the response text by removing any markdown formatting
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim()

    try {
      // Parse the JSON response
      const questionData = JSON.parse(cleanedText)

      if (!questionData.question || !questionData.question.text) {
        throw new Error('Invalid response format')
      }

      return NextResponse.json({
        title: lessonId,
        question: questionData.question
      })
    } catch (error) {
      return new NextResponse('Error processing response', { status: 500 })
    }
  } catch (error) {
    console.error('Error in teach API:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { conversationHistory } = await request.json()
    const lessonId = decodeURIComponent(params.id)

    // Generate next Socratic question based on conversation history
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `You are Socrates, but speak in simple, everyday language that anyone can understand.
    Continue the conversation about: "${lessonId}"

    Previous conversation:
    ${conversationHistory.map((q: ConversationItem) => `
    Socrates: ${q.text}
    Student: ${q.userAnswer}
    Socrates: ${q.feedback}
    `).join('\n')}

    First, decide if the student has shown good understanding of the topic. Look for:
    1. Clear and accurate answers
    2. Understanding of key concepts
    3. Ability to explain ideas in their own words
    4. Consistent understanding across multiple questions

    If the student has shown good understanding, provide a summary that:
    1. Uses simple, everyday words
    2. Explains the main ideas they've learned
    3. Shows how their answers fit together
    4. Is encouraging and positive
    5. Is 3-4 sentences long

    If they're still learning, ask a simple follow-up question that will:
    1. Use everyday words and short sentences
    2. Build on what they just said
    3. Help them think more about the topic
    4. Focus on one main idea
    5. Be easy to understand

    Return ONLY a raw JSON object (no markdown formatting, no code blocks) with this exact structure:
    If they understand well:
    {
      "summary": {
        "id": ${conversationHistory.length + 1},
        "text": "your summary here"
      }
    }

    If they're still learning:
    {
      "question": {
        "id": ${conversationHistory.length + 1},
        "text": "your next question here"
      }
    }`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Clean the response text by removing any markdown formatting
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim()

    try {
      // Parse the JSON response
      const responseData = JSON.parse(cleanedText)

      if (responseData.summary) {
        if (!responseData.summary.text) {
          throw new Error('Invalid summary format')
        }
        return NextResponse.json({
          summary: responseData.summary
        })
      } else if (responseData.question) {
        if (!responseData.question.text) {
          throw new Error('Invalid question format')
        }
        return NextResponse.json({
          question: responseData.question
        })
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      return new NextResponse('Error processing response', { status: 500 })
    }
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}