'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ReflectionModal from '../components/ReflectionModal'

interface Progress {
  lessonId: string
  isCompleted: boolean
  lastQuestionIndex: number
  conversationHistory: any[]
  updatedAt: string
}

interface Lesson {
  day: number
  concepts: string[]
}

interface Curriculum {
  id: string
  topic: string
  startDate: string
  lessons: Lesson[]
  progress: Record<string, Progress>
}

export default function ProgressPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null)
  const [isLoadingCurriculum, setIsLoadingCurriculum] = useState(true)
  const [progressData, setProgressData] = useState<Record<string, Progress>>({})
  const [currentDay, setCurrentDay] = useState(1)
  const [showReflectionModal, setShowReflectionModal] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    const fetchCurriculum = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch('/api/curriculum/active')
          if (response.ok) {
            const data = await response.json()
            setCurriculum(data)
            if (data?.progress) {
              setProgressData(data.progress)
            }
          }
        } catch (err) {
          console.error('Error fetching curriculum:', err)
        } finally {
          setIsLoadingCurriculum(false)
        }
      }
    }

    fetchCurriculum()
  }, [session?.user?.id])

  // Calculate current day based on curriculum start date
  useEffect(() => {
    if (curriculum?.startDate) {
      const startDate = new Date(curriculum.startDate)
      const today = new Date()
      
      // Set both dates to midnight for accurate day calculation
      startDate.setHours(0, 0, 0, 0)
      today.setHours(0, 0, 0, 0)
      
      const diffTime = today.getTime() - startDate.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      setCurrentDay(diffDays + 1) // Add 1 because day 1 is the start date
    }
  }, [curriculum?.startDate])

  // Check if all lectures for the day are completed
  useEffect(() => {
    const checkDailyCompletion = async () => {
      if (!curriculum?.lessons) return

      const todaysLessons = curriculum.lessons.find((lesson: Lesson) => lesson.day === currentDay)
      if (!todaysLessons) return

      const allCompleted = todaysLessons.concepts.every(concept => 
        progressData[encodeURIComponent(concept)]?.isCompleted
      )

      if (allCompleted) {
        // Check if a journal entry already exists for today
        try {
          const response = await fetch(`/api/journal/check?day=${currentDay}`)
          if (response.ok) {
            const { exists } = await response.json()
            if (!exists) {
              setShowReflectionModal(true)
            }
          }
        } catch (error) {
          console.error('Error checking journal entry:', error)
        }
      }
    }

    checkDailyCompletion()
  }, [curriculum, progressData, currentDay])

  const handleReflectionSubmit = async (reflection: string) => {
    try {
      const response = await fetch('/api/reflection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reflection,
          day: currentDay
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit reflection')
      }

      // Optionally refresh the curriculum data to show the new journal entry
      const curriculumResponse = await fetch('/api/curriculum/active')
      if (curriculumResponse.ok) {
        const data = await curriculumResponse.json()
        setCurriculum(data)
        if (data?.progress) {
          setProgressData(data.progress)
        }
      }
    } catch (error) {
      console.error('Error submitting reflection:', error)
      throw error
    }
  }

  if (status === 'loading' || isLoadingCurriculum) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4A5568]"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  // Calculate total lectures and completed lectures
  const calculateProgress = () => {
    if (!curriculum?.lessons) return { total: 0, completed: 0, percentage: 0 }
    
    const lessons = curriculum.lessons as Lesson[]
    let totalLectures = 0
    let completedLectures = 0

    lessons.forEach(lesson => {
      // Only count lectures up to the current day
      if (lesson.day <= currentDay) {
        lesson.concepts.forEach(concept => {
          totalLectures++
          if (progressData[encodeURIComponent(concept)]?.isCompleted) {
            completedLectures++
          }
        })
      }
    })

    const percentage = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0
    return { total: totalLectures, completed: completedLectures, percentage }
  }

  const { total: totalLectures, completed: completedLectures, percentage: progressPercentage } = calculateProgress()

  // Get today's upcoming lessons
  const getTodaysUpcomingLessons = () => {
    if (!curriculum?.lessons) return []
    
    const lessons = curriculum.lessons as Lesson[]
    const todaysLessons = lessons.find(lesson => lesson.day === currentDay)
    
    if (!todaysLessons) return []

    return todaysLessons.concepts.map((concept: string, index) => {
      const isCompleted = progressData[encodeURIComponent(concept)]?.isCompleted
      return {
        day: currentDay,
        concept,
        index,
        isCompleted
      }
    }).filter(lesson => !lesson.isCompleted)
  }

  const todaysUpcomingLessons = getTodaysUpcomingLessons()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-serif font-light text-[#131757] mb-2">Progress</h1>
        <p className="text-lg text-[#4A5568]">Track your learning journey and achievements.</p>
      </div>

      {curriculum ? (
        <div className="space-y-8">
          {/* Overall Progress Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-serif font-semibold text-[#131757] mb-4">
              Your Current Plan: {curriculum.topic}
            </h2>
            <p className="text-[#4A5568] mb-4">
              Started on {new Date(curriculum.startDate).toLocaleDateString()} • Day {currentDay}
            </p>
            
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-[#131757] mb-2">Overall Progress</h3>
                <p className="text-lg text-[#4A5568]">{completedLectures} of {totalLectures} lectures completed</p>
              </div>
              {/* Circular Progress Bar */}
              <div className="relative w-24 h-24">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#609EDB"
                    strokeWidth="3"
                    strokeDasharray={`${progressPercentage}, 100`}
                    className="transition-all duration-500 ease-in-out"
                    style={{
                      strokeDasharray: `${progressPercentage}, 100`,
                      transform: 'rotate(-90deg)',
                      transformOrigin: '50% 50%'
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-semibold text-[#131757]">{progressPercentage}%</span>
                </div>
              </div>
            </div>

            {/* Today's Upcoming Lessons */}
            <div className="mt-8">
              <h3 className="text-xl font-serif font-semibold text-[#131757] mb-4">Today's Lessons</h3>
              {todaysUpcomingLessons.length > 0 ? (
                <div className="space-y-4">
                  {todaysUpcomingLessons.map((lesson, index) => (
                    <div 
                      key={`${lesson.day}-${lesson.index}`}
                      className="flex items-center justify-between p-4 bg-[#f5f8fc] rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium text-[#131757]">{lesson.concept}</h4>
                        <p className="text-sm text-[#4A5568]">Lesson {index + 1}</p>
                      </div>
                      <button
                        onClick={() => router.push('/lectures')}
                        className="px-4 py-2 bg-[#609EDB] text-white rounded-md hover:bg-[#4a8acb] transition-colors"
                      >
                        Go to Lectures
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#4A5568]">All lessons for today completed! Great job!</p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-serif font-semibold text-[#131757] mb-4">Recent Activity</h3>
            {Object.entries(progressData)
              .filter(([_, progress]) => progress.isCompleted)
              .sort(([_, a], [__, b]) => b.lastQuestionIndex - a.lastQuestionIndex)
              .slice(0, 5)
              .map(([lessonId, progress]) => (
                <div key={lessonId} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <h4 className="font-medium text-[#131757]">{decodeURIComponent(lessonId)}</h4>
                    <p className="text-sm text-[#4A5568]">
                      Completed {new Date(progress.updatedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-green-600 font-medium">Completed</div>
                </div>
              ))}
            {Object.keys(progressData).length === 0 && (
              <p className="text-[#4A5568]">No recent activity yet. Start your first lesson!</p>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-lg text-[#4A5568]">No active learning plan found. Go to the dashboard to create one!</p>
        </div>
      )}

      <ReflectionModal
        isOpen={showReflectionModal}
        onClose={() => setShowReflectionModal(false)}
        onSubmit={handleReflectionSubmit}
      />
    </div>
  )
} 