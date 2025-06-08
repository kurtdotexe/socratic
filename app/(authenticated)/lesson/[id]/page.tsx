'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { LessonLayout } from '../../components/LessonLayout'

interface Question {
  id: number
  text: string
  userAnswer?: string
  feedback?: string
}

export default function LessonPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [userInput, setUserInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lessonTitle, setLessonTitle] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [conversationHistory, setConversationHistory] = useState<Question[]>([])
  const [isConversationComplete, setIsConversationComplete] = useState(false)

  useEffect(() => {
    const startLesson = async () => {
      try {
        // First, try to load existing progress
        const progressResponse = await fetch(`/api/progress?lessonId=${params.id}`)
        if (progressResponse.ok) {
          const progressData = await progressResponse.json()
          if (progressData.conversationHistory?.length > 0) {
            setConversationHistory(progressData.conversationHistory)
            if (progressData.isCompleted) {
              setIsConversationComplete(true)
              setCurrentQuestion({
                id: progressData.conversationHistory.length + 1,
                text: progressData.conversationHistory[progressData.conversationHistory.length - 1].text
              })
              // Ensure the lesson stays marked as completed
              await fetch('/api/progress', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  lessonId: params.id,
                  conversationHistory: progressData.conversationHistory,
                  isCompleted: true
                }),
              })
              return
            }
          }
        }

        // If no progress or not completed, start new lesson
        const response = await fetch(`/api/teach/${encodeURIComponent(params.id)}`)
        if (!response.ok) {
          throw new Error('Failed to start lesson')
        }
        const data = await response.json()
        setCurrentQuestion(data.question)
        setLessonTitle(data.title)
        setError(null)
      } catch (error) {
        console.error('Error starting lesson:', error)
        setError('Unable to start the lesson. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    if (session?.user?.id) {
      startLesson()
    }
  }, [session?.user?.id, params.id])

  const handleSubmit = async () => {
    if (!userInput.trim() || !currentQuestion) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/teach/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          userAnswer: userInput,
          lessonId: params.id,
          conversationHistory: conversationHistory,
          currentQuestion: currentQuestion
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to evaluate answer')
      }

      const data = await response.json()
      
      // Add the current Q&A to history
      const updatedHistory = [...conversationHistory, {
        ...currentQuestion,
        userAnswer: userInput,
        feedback: data.feedback
      }]
      setConversationHistory(updatedHistory)

      // Get the next question or summary
      const nextQuestionResponse = await fetch(`/api/teach/${encodeURIComponent(params.id)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationHistory: updatedHistory
        }),
      })

      if (!nextQuestionResponse.ok) {
        throw new Error('Failed to get next question')
      }

      const nextQuestionData = await nextQuestionResponse.json()
      
      if (nextQuestionData.summary) {
        // If we got a summary, show it and end the conversation
        const finalQuestion = {
          id: nextQuestionData.summary.id,
          text: nextQuestionData.summary.text
        }
        setCurrentQuestion(finalQuestion)
        setIsConversationComplete(true)

        // Save progress with the summary included
        const finalHistory = [...updatedHistory, finalQuestion]
        console.log('Saving progress with summary:', {
          lessonId: params.id,
          conversationHistoryLength: finalHistory.length,
          isCompleted: true
        })
        const progressResponse = await fetch('/api/progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lessonId: params.id,
            conversationHistory: finalHistory,
            isCompleted: true
          }),
        })

        if (!progressResponse.ok) {
          const errorData = await progressResponse.json()
          console.error('Failed to save progress with summary:', errorData)
          throw new Error('Failed to save progress')
        }

        const savedProgress = await progressResponse.json()
        console.log('Progress saved with summary:', savedProgress)
      } else {
        // If we got a question, continue the conversation
        setCurrentQuestion(nextQuestionData.question)
        
        // Save current progress
        console.log('Saving intermediate progress:', {
          lessonId: params.id,
          conversationHistoryLength: updatedHistory.length,
          isCompleted: false
        })
        const progressResponse = await fetch('/api/progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lessonId: params.id,
            conversationHistory: updatedHistory,
            isCompleted: false
          }),
        })

        if (!progressResponse.ok) {
          const errorData = await progressResponse.json()
          console.error('Failed to save intermediate progress:', errorData)
          throw new Error('Failed to save progress')
        }

        const savedProgress = await progressResponse.json()
        console.log('Intermediate progress saved:', savedProgress)
      }
      
      setUserInput('')
    } catch (error) {
      console.error('Error in conversation:', error)
      setError('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackToLectures = async () => {
    try {
      setIsSubmitting(true)
      console.log('Saving progress before redirect:', {
        lessonId: params.id,
        conversationHistoryLength: conversationHistory.length,
        isCompleted: true
      })
      // Save progress with isCompleted: true before redirecting
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId: params.id,
          conversationHistory: conversationHistory,
          isCompleted: true
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Progress save failed:', errorData)
        throw new Error('Failed to save progress')
      }

      const savedProgress = await response.json()
      console.log('Progress saved successfully:', savedProgress)

      // Only redirect after successful save
      router.push('/lectures')
    } catch (error) {
      console.error('Error saving progress:', error)
      setError('Failed to save progress. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <LessonLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4A5568]"></div>
        </div>
      </LessonLayout>
    )
  }

  if (error) {
    return (
      <LessonLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-serif font-semibold text-[#2D3748] mb-4">Error</h2>
            <p className="text-[#4A5568] mb-6">{error}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-[#4A5568] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#2D3748] transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </LessonLayout>
    )
  }

  return (
    <LessonLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-semibold text-[#2D3748] mb-2">
            {lessonTitle}
          </h1>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#4A5568] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(conversationHistory.length / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-6">
          {conversationHistory.map((q, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <h3 className="text-lg font-serif font-semibold text-[#2D3748] mb-2">
                  {q.text}
                </h3>
                <p className="text-[#4A5568] italic">{q.userAnswer}</p>
              </div>
              {q.feedback && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-[#4A5568]">{q.feedback}</p>
                </div>
              )}
            </div>
          ))}

          {currentQuestion && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-serif font-semibold text-[#2D3748] mb-4">
                {currentQuestion.text}
              </h3>
              {isConversationComplete ? (
                <div className="space-y-4">
                  <p className="text-[#4A5568] mb-4">Great job! You've shown a good understanding of this topic.</p>
                  <button
                    onClick={handleBackToLectures}
                    disabled={isSubmitting}
                    className="w-full bg-[#4A5568] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#2D3748] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Saving...' : 'Back to Lectures'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A5568] focus:border-transparent resize-none"
                    disabled={isSubmitting}
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !userInput.trim()}
                    className="w-full bg-[#4A5568] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#2D3748] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Thinking...' : 'Submit Answer'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </LessonLayout>
  )
} 