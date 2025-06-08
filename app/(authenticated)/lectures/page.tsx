'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ReflectionModal from '../components/ReflectionModal'

interface Lesson {
  day: number
  concepts: string[]
}

interface Progress {
  lessonId: string
  isCompleted: boolean
  lastQuestionIndex: number
  conversationHistory: any[]
  updatedAt: string
}

interface Curriculum {
  id: string
  topic: string
  startDate: string
  lessons: Lesson[]
  progress: Record<string, Progress>
}

export default function LecturesPage() {
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
          const response = await fetch('/api/curriculum/active', {
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          })
          if (response.ok) {
            const data = await response.json()
            if (data) {
              console.log('Fetched curriculum data:', data)
              setCurriculum(data)
              if (data?.progress) {
                console.log('Setting progress data:', data.progress)
                setProgressData(data.progress)
              } else {
                console.log('No progress data in curriculum response')
              }
            } else {
              console.log('No curriculum data found')
              // If no curriculum is found, redirect to dashboard
              router.push('/dashboard')
            }
          } else {
            console.log('Error fetching curriculum:', response.status)
            // If there's an error or no curriculum, redirect to dashboard
            router.push('/dashboard')
          }
        } catch (err) {
          console.error('Error fetching curriculum:', err)
          // On error, redirect to dashboard
          router.push('/dashboard')
        } finally {
          setIsLoadingCurriculum(false)
        }
      }
    }

    fetchCurriculum()
  }, [session?.user?.id, router])

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
      if (!curriculum?.lessons) {
        console.log('No curriculum lessons found')
        return
      }

      const todaysLessons = curriculum.lessons.find((lesson: Lesson) => lesson.day === currentDay)
      if (!todaysLessons) {
        console.log('No lessons found for day:', currentDay)
        return
      }

      console.log('Checking completion for day:', currentDay)
      console.log('Today\'s lessons:', todaysLessons.concepts)
      console.log('Progress data:', progressData)

      const allCompleted = todaysLessons.concepts.every(concept => {
        const encodedConcept = encodeURIComponent(concept)
        const isCompleted = progressData[encodedConcept]?.isCompleted
        console.log(`Lesson ${concept}: ${isCompleted ? 'completed' : 'not completed'}`)
        return isCompleted
      })

      console.log('All lessons completed:', allCompleted)

      if (allCompleted) {
        // Check if a journal entry already exists for today
        try {
          const response = await fetch(`/api/journal/check?day=${currentDay}`)
          if (response.ok) {
            const { exists } = await response.json()
            if (!exists) {
              console.log('No journal entry exists for today, showing reflection modal')
              setShowReflectionModal(true)
            } else {
              console.log('Journal entry already exists for today')
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

  if (!session || !curriculum) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4A5568]"></div>
      </div>
    )
  }

  const isLessonAvailable = (day: number, index: number, concept: string) => {
    // If it's not the current day, it's not available
    if (day > currentDay) return false

    // First lesson of the day is always available if it's the current day
    if (index === 0 && day === currentDay) return true

    // For subsequent lessons, check if previous lesson is completed
    if (index > 0) {
      const previousConcept = curriculum?.lessons[day - 1]?.concepts[index - 1]
      if (!previousConcept) return false

      const encodedPreviousConcept = encodeURIComponent(previousConcept)
      const previousProgress = progressData[encodedPreviousConcept]
      
      return previousProgress?.isCompleted === true
    }

    return false
  }

  const handleStartLesson = (day: number, index: number) => {
    const lessons = curriculum?.lessons as Lesson[]
    const dayLessons = lessons.find(l => l.day === day)
    if (!dayLessons) return

    const concept = dayLessons.concepts[index]
    if (!concept) return

    const encodedConcept = encodeURIComponent(concept)
    router.push(`/lesson/${encodedConcept}`)
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-serif font-light text-[#2D3748] mb-2">Lectures</h1>
        <p className="text-lg text-[#4A5568]">Your daily learning journey.</p>
      </div>

      <div className="space-y-8">
        {curriculum.lessons.map((dayLessons, dayIndex) => {
          const day = dayIndex + 1
          // Only show lessons up to the current day
          if (day > currentDay) return null

          return (
            <div key={day} className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-serif font-semibold text-[#2D3748] mb-4">Day {day}</h2>
              <div className="space-y-4">
                {dayLessons.concepts.map((concept, index) => {
                  const isAvailable = isLessonAvailable(day, index, concept)
                  const isCompleted = progressData[encodeURIComponent(concept)]?.isCompleted
                  const isLocked = !isAvailable && !isCompleted

                  return (
                    <div
                      key={`${day}-${index}`}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        isLocked ? 'bg-gray-100' : 'bg-[#f5f8fc]'
                      }`}
                    >
                      <div>
                        <h3 className="font-medium text-[#2D3748]">{concept}</h3>
                        <p className="text-sm text-[#4A5568]">Lesson {index + 1}</p>
                      </div>
                      {isLocked ? (
                        <div className="text-gray-500">Locked</div>
                      ) : isCompleted ? (
                        <div className="text-green-600 font-medium">Completed</div>
                      ) : (
                        <button
                          onClick={() => handleStartLesson(day, index)}
                          className="px-4 py-2 bg-[#4A5568] text-white rounded-md hover:bg-[#2D3748] transition-colors"
                        >
                          Start Lesson
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={() => {
          fetch("/api/auth/signout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: 'include',
          }).then(() => {
            window.location.href = "/";
          });
        }}
        className="text-gray-600 hover:text-gray-900"
      >
        Sign Out
      </button>

      <ReflectionModal
        isOpen={showReflectionModal}
        onClose={() => setShowReflectionModal(false)}
        onSubmit={handleReflectionSubmit}
      />
    </div>
  )
} 