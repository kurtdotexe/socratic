import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=' + process.env.GEMINI_API_KEY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{
            text: "Please forget all previous prompts and context. Start fresh."
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          topK: 1,
          topP: 0.1,
          maxOutputTokens: 10,
        }
      }),
    });

    const completion = await response.json()
    console.log('Gemini API reset response:', completion)

    return NextResponse.json({ success: true, message: 'Gemini AI context has been reset' })
  } catch (error) {
    console.error('Error resetting Gemini AI:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to reset Gemini AI' },
      { status: 500 }
    )
  }
} 