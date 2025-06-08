'use client'

import { useState } from 'react'

interface ReflectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (reflection: string) => Promise<void>
}

export default function ReflectionModal({ isOpen, onClose, onSubmit }: ReflectionModalProps) {
  const [reflection, setReflection] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit(reflection)
      setReflection('')
      onClose()
    } catch (error) {
      console.error('Error submitting reflection:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <h2 className="text-2xl font-serif font-semibold text-[#2D3748] mb-4">
          Daily Learning Reflection
        </h2>
        <p className="text-[#4A5568] mb-4">
          Congratulations on completing today's lectures! Take a moment to reflect on what you've learned.
          Share your thoughts, insights, and any questions you have. Our AI will help summarize your learning journey.
        </p>
        <form onSubmit={handleSubmit}>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="What did you learn today? What concepts were most interesting? What questions do you still have?"
            className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A5568] focus:border-transparent resize-none"
            required
          />
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[#4A5568] hover:text-[#2D3748] transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#4A5568] text-white rounded-md hover:bg-[#2D3748] transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Reflection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 