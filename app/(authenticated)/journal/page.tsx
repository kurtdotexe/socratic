'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface JournalEntry {
  id: string
  reflection: string
  summary: string
  createdAt: string
}

export default function JournalPage() {
  const { data: session, status } = useSession()
  const [journals, setJournals] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJournals = async () => {
      setLoading(true)
      const res = await fetch('/api/journal')
      if (res.ok) {
        const data = await res.json()
        setJournals(data)
      }
      setLoading(false)
    }
    if (status === 'authenticated') fetchJournals()
  }, [status])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4A5568]"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-8">
      <h1 className="text-4xl font-serif font-light text-[#131757] mb-6">Recent Journal Entries</h1>
      {journals.length === 0 ? (
        <p className="text-[#4A5568]">No journal entries yet.</p>
      ) : (
        <div className="space-y-6">
          {journals.map(journal => (
            <div key={journal.id} className="bg-white rounded-lg shadow p-6">
              <div className="mb-2 text-xs text-gray-500">
                {new Date(journal.createdAt).toLocaleString()}
              </div>
              <div className="mb-2">
                <span className="font-semibold text-[#131757]">Reflection:</span>
                <div className="text-[#4A5568] whitespace-pre-line">{journal.reflection}</div>
              </div>
              <div>
                <span className="font-semibold text-[#131757]">AI Summary:</span>
                <div className="text-[#4A5568] whitespace-pre-line">{journal.summary}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 