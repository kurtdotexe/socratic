'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(path) // Handles /journal/entry1, /progress/lesson3, etc.
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="h-screen overflow-hidden bg-white">
      <div className="flex h-full">
        {/* Sidebar - Fixed */}
        <div className="w-64 h-screen bg-[#f5f8fc] shadow-lg flex flex-col">
          <div className="p-6">
            <Link href="/dashboard" className="text-2xl font-serif font-light text-[#2a365d] uppercase">
              SOCRATIC
            </Link>
            <div className="mt-4 text-sm text-[#3a4a6b]">
              <div className="font-medium">{formatDate(currentTime)}</div>
              <div className="text-[#4A5568]">{formatTime(currentTime)}</div>
            </div>
          </div>
          <nav className="mt-6">
            <div className="px-4 space-y-1">
              <Link
                href="/dashboard"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive('/dashboard')
                    ? 'bg-white text-[#2a365d]'
                    : 'text-[#3a4a6b] hover:bg-white hover:text-[#2a365d]'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>
              <Link
                href="/lectures"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive('/lectures')
                    ? 'bg-white text-[#2a365d]'
                    : 'text-[#3a4a6b] hover:bg-white hover:text-[#2a365d]'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Lectures
              </Link>
              <Link
                href="/progress"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive('/progress')
                    ? 'bg-white text-[#2a365d]'
                    : 'text-[#3a4a6b] hover:bg-white hover:text-[#2a365d]'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Progress
              </Link>
              <Link
                href="/journal"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive('/journal')
                    ? 'bg-white text-[#2a365d]'
                    : 'text-[#3a4a6b] hover:bg-white hover:text-[#2a365d]'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Journal
              </Link>
              <Link
                href="/settings"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive('/settings')
                    ? 'bg-white text-[#2a365d]'
                    : 'text-[#3a4a6b] hover:bg-white hover:text-[#2a365d]'
                }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </Link>
            </div>
          </nav>
          <div className="mt-auto p-4">
            <div className="px-4 py-3 text-sm text-[#3a4a6b]">
              {session?.user?.name}
            </div>
            <Link
              href="/auth/signout"
              className="flex items-center px-4 py-3 text-sm font-medium text-[#3a4a6b] hover:bg-white hover:text-[#2a365d] rounded-lg"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </Link>
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="py-20 px-12 bg-white">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}