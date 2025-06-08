
'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import Link from 'next/link'

const prisma = new PrismaClient()

const quotes = [
  { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
  { text: "The unexamined life is not worth living.", author: "Socrates" },
  { text: "I cannot teach anybody anything. I can only make them think.", author: "Socrates" },
  { text: "There is only one good, knowledge, and one evil, ignorance.", author: "Socrates" },
  { text: "Be kind, for everyone you meet is fighting a hard battle.", author: "Socrates" },
  { text: "Strong minds discuss ideas, average minds discuss events, weak minds discuss people.", author: "Socrates" },
  { text: "Wonder is the beginning of wisdom.", author: "Socrates" },
  { text: "To find yourself, think for yourself.", author: "Socrates" },
  { text: "Education is the kindling of a flame, not the filling of a vessel.", author: "Socrates" },
  { text: "He who is not contented with what he has, would not be contented with what he would like to have.", author: "Socrates" },
  { text: "Be slow to fall into friendship, but when you are in, continue firm and constant.", author: "Socrates" },
  { text: "The secret of happiness, you see, is not found in seeking more, but in developing the capacity to enjoy less.", author: "Socrates" },
  { text: "Know thyself.", author: "Socrates" },
  { text: "Let him who would move the world first move himself.", author: "Socrates" },
  { text: "Contentment is natural wealth, luxury is artificial poverty.", author: "Socrates" },
  { text: "Death may be the greatest of all human blessings.", author: "Socrates" },
  { text: "Do not do to others what angers you if done to you by others.", author: "Socrates" },
  { text: "The only good is knowledge and the only evil is ignorance.", author: "Socrates" },
  { text: "Every action has its pleasures and its price.", author: "Socrates" },
  { text: "Prefer knowledge to wealth, for the one is transitory, the other perpetual.", author: "Socrates" },
  { text: "We cannot live better than in seeking to become better.", author: "Socrates" },
  { text: "We can easily forgive a child who is afraid of the dark; the real tragedy of life is when men are afraid of the light.", author: "Socrates" },
]

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [topic, setTopic] = useState('')
  const [days, setDays] = useState(7)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [curriculum, setCurriculum] = useState<any>(null)
  const [isLoadingCurriculum, setIsLoadingCurriculum] = useState(true)
  const [isViewingLessons, setIsViewingLessons] = useState(false)
  const [currentDay, setCurrentDay] = useState(1)
  const [activeLessonIndex, setActiveLessonIndex] = useState(0)

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
            setCurriculum(data)
            console.log('Fetched curriculum:', data)
          } else {
            setCurriculum(null)
          }
        } catch (err) {
          console.error('Error fetching curriculum:', err)
          setCurriculum(null)
        } finally {
          setIsLoadingCurriculum(false)
        }
      }
    }

    fetchCurriculum()
  }, [session?.user?.id])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      console.log('Submitting curriculum creation request...')
      const response = await fetch('/api/curriculum/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          topic,
          days,
        }),
      })

      const data = await response.json()
      console.log('Curriculum creation response:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create curriculum')
      }

      setCurriculum(data)
    } catch (err) {
      console.error('Error creating curriculum:', err)
      setError(err instanceof Error ? err.message : 'Failed to create curriculum. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartLesson = () => {
    router.push('/lectures')
  }

  const lessonsForToday = Array.isArray(curriculum?.lessons)
    ? curriculum.lessons.find((lesson: any) => lesson.day === currentDay)?.concepts || []
    : []

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]

  return (
    <div className="relative min-h-[600px]">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-4xl md:text-5xl font-serif font-light text-[#131757]">
          Welcome, {session.user.name}
        </h1>
        <button
          onClick={async () => {
            try {
              const response = await fetch('/api/auth/signout', {
                method: 'POST',
                credentials: 'include',
              });
              if (response.ok) {
                window.location.href = '/';
              }
            } catch (error) {
              console.error('Error signing out:', error);
            }
          }}
          className="px-4 py-2 text-[#609EDB] hover:text-[#131757] transition-colors"
        >
          Sign Out
        </button>
      </div>

      {!curriculum ? (
        <div className="mt-8 bg-white rounded-lg shadow-lg p-8 max-w-2xl">
          <h2 className="text-2xl font-serif font-semibold text-[#131757] mb-4">Create Your Learning Plan</h2>
          <p className="text-[#4A5568] mb-6">
            You don't have an active learning plan yet. Let's create one tailored to your interests and schedule.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="topic" className="block text-[#131757] font-medium mb-2">
                What would you like to learn?
              </label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Machine Learning, Philosophy, Web Development"
                className="w-full px-4 py-2 border border-[#609EDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#609EDB]"
                required
              />
            </div>

            <div>
              <label htmlFor="days" className="block text-[#131757] font-medium mb-2">
                How many days would you like to study this topic?
              </label>
              <input
                type="number"
                id="days"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                min="1"
                max="90"
                className="w-full px-4 py-2 border border-[#609EDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#609EDB]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#609EDB] text-white px-8 py-3 rounded-lg font-semibold text-lg shadow hover:bg-[#4a8acb] transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Creating Your Plan...' : 'Create Learning Plan'}
            </button>
          </form>
        </div>
      ) : (
        isViewingLessons ? (
          <div className="flex min-h-[600px] bg-gray-50">
            <div className="w-64 bg-white shadow-lg p-6">
              <h2 className="text-xl font-serif font-semibold text-[#2D3748] mb-4">Course Progress</h2>
              <div className="space-y-2">
                {Array.from({ length: curriculum.days }, (_, i) => (
                  <div 
                    key={i}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      i + 1 === currentDay 
                        ? 'bg-[#4A5568] text-white' 
                        : i + 1 < currentDay 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                    }`}
                    onClick={() => {
                      if (i + 1 <= currentDay) {
                        setCurrentDay(i + 1);
                        setActiveLessonIndex(0);
                      }
                    }}
                  >
                    Day {i + 1}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 p-8">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-serif font-semibold text-[#2D3748]">Day {currentDay}</h2>
                  <button 
                    onClick={() => setIsViewingLessons(false)}
                    className="px-4 py-2 text-[#4A5568] hover:text-[#2D3748] transition-colors"
                  >
                    ← Back to Dashboard
                  </button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-serif font-semibold text-[#2D3748] mb-6">Daily Lessons</h3>
                  {(() => {
                    const lessonsArray = Array.isArray(curriculum?.lessons) ? curriculum.lessons : [];
                    const lessonsForToday = lessonsArray.find((lesson: any) => lesson.day === currentDay)?.concepts || [];

                    if (lessonsForToday.length > 0) {
                      return lessonsForToday.map((concept: string, index: number) => (
                        <div 
                          key={index} 
                          className={`bg-white rounded-lg shadow-lg p-6 transition-all duration-200 ${
                            index === activeLessonIndex 
                              ? 'border-l-4 border-[#4A5568] cursor-pointer hover:bg-[#f5f8fc]' 
                              : index < activeLessonIndex 
                                ? 'border-l-4 border-green-500 opacity-75' 
                                : 'opacity-50 cursor-not-allowed'
                          }`}
                          onClick={() => {
                            if (index === activeLessonIndex) {
                              console.log(`Lesson ${index + 1} for Day ${currentDay} clicked!`);
                              router.push(`/lesson/${encodeURIComponent(concept)}`);
                            }
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              index === activeLessonIndex 
                                ? 'bg-[#4A5568] text-white' 
                                : index < activeLessonIndex 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-gray-200 text-gray-500'
                            }`}>
                              {index + 1}
                            </div>
                            <p className="text-lg font-medium text-[#4A5568]">{concept}</p>
                          </div>
                        </div>
                      ));
                    } else if (lessonsArray.length > 0) {
                      return (
                        <div className="bg-white rounded-lg shadow-lg p-6">
                          <p className="text-lg text-[#4A5568]">No lessons found for Day {currentDay}.</p>
                        </div>
                      );
                    } else {
                      return (
                        <div className="bg-white rounded-lg shadow-lg p-6">
                          <p className="text-lg text-[#4A5568]">Curriculum data is not in the expected format. Please create a new plan.</p>
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            <p className="text-lg text-[#4A5568] mb-6">
              Begin your daily exploration of knowledge.
            </p>
            <button 
              className="bg-[#609EDB] text-white px-6 py-2 rounded-lg font-semibold text-base shadow hover:bg-[#4a8acb] transition-colors"
              onClick={handleStartLesson}
            >
              Start Lesson
            </button>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-serif font-semibold text-[#131757] mb-4">Your Progress</h2>
              <div className="flex items-center justify-between">
                <div>
                  {(() => {
                    const lessonsArray = Array.isArray(curriculum?.lessons) ? curriculum.lessons : [];
                    let totalLessons = 0;
                    let completedLessons = 0;

                    lessonsArray.forEach((lesson: any) => {
                      if (lesson.day <= currentDay) {
                        lesson.concepts?.forEach((concept: string) => {
                          totalLessons++;
                          if (typeof window !== 'undefined') {
                          }
                        });
                      }
                    });

                    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

                    return (
                      <>
                        <p className="text-lg text-[#4A5568]">{completedLessons} Completed</p>
                        <p className="text-lg text-[#4A5568]">{totalLessons - completedLessons} Lessons Remaining</p>
                      </>
                    );
                  })()}
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-[#609EDB] flex items-center justify-center relative">
                  <div className="absolute text-sm font-semibold text-[#131757]">
                    {(() => {
                      const lessonsArray = Array.isArray(curriculum?.lessons) ? curriculum.lessons : [];
                      let totalLessons = 0;
                      let completedLessons = 0;

                      lessonsArray.forEach((lesson: any) => {
                        if (lesson.day <= currentDay) {
                          totalLessons += lesson.concepts?.length || 0;
                        }
                      });

                      return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
                    })()}%
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-serif font-semibold text-[#131757] mb-4">Quote of the Day</h2>
              <p className="text-lg text-[#4A5568] italic">"{randomQuote.text}"</p>
              <p className="text-[#609EDB] text-sm mt-2 text-right">- {randomQuote.author}</p>
            </div>
          </div>
        )
      )}
    </div>
  )
}
