'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to permanently delete your account and all associated data? This action cannot be undone.')) {
      try {
        const response = await fetch('/api/user/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to delete account')
        }

        // Account deleted successfully, sign out the user
        const signoutResponse = await fetch('/api/auth/signout', {
          method: 'POST',
          credentials: 'include',
        });
        
        if (signoutResponse.ok) {
          window.location.href = '/';
        }

      } catch (error) {
        console.error('Error deleting account:', error)
        alert(`Failed to delete account: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#609EDB]"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-serif font-light text-[#131757] mb-2">Settings</h1>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-serif font-semibold text-[#131757] mb-4">Profile Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-[#131757] font-medium mb-2">Email</label>
            <input
              type="email"
              value={session.user?.email || ''}
              disabled
              className="w-full px-4 py-2 border border-[#609EDB] rounded-lg bg-[#f1f7fb] text-[#4A5568]"
            />
          </div>
          <div>
            <label className="block text-[#131757] font-medium mb-2">Name</label>
            <input
              type="text"
              value={session.user?.name || ''}
              disabled
              className="w-full px-4 py-2 border border-[#609EDB] rounded-lg bg-[#f1f7fb] text-[#4A5568]"
            />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-red-200">
        <h2 className="text-2xl font-serif font-semibold text-red-600 mb-4">Danger Zone</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-[#131757] font-medium">Delete Account</h3>
            <p className="text-[#4A5568] text-sm mb-4">Permanently delete your account and all data</p>
            <button 
              onClick={handleDeleteAccount}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 