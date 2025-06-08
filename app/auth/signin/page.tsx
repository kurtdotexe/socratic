'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function SignInPage() {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      if (isSignUp) {
        const signupResponse = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, name }),
        })

        const signupData = await signupResponse.json()

        if (!signupResponse.ok) {
          throw new Error(signupData.error || 'Something went wrong')
        }
      }

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f1f7fb' }}>
      <div className="max-w-md w-full space-y-8 px-8 py-12">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <img src="/assets/logo_blue.png" alt="Socratic Logo" className="h-16 w-16 mr-3" />
            <div>
              <h1 className="text-4xl font-bold font-serif text-[#131757]">SOCRATIC</h1>
              <p className="text-lg text-[#609EDB]">Expand. Be more.</p>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-[#131757]">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="mt-2 text-[#4A5568]">
            {isSignUp ? 'Start your learning journey today' : 'Continue your learning journey'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#131757] mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-[#e3eaf3] placeholder-gray-500 text-[#131757] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#609EDB] focus:border-[#609EDB] focus:z-10 bg-white"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#131757] mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-[#e3eaf3] placeholder-gray-500 text-[#131757] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#609EDB] focus:border-[#609EDB] focus:z-10 bg-white"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#131757] mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-[#e3eaf3] placeholder-gray-500 text-[#131757] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#609EDB] focus:border-[#609EDB] focus:z-10 bg-white"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-lg text-white bg-[#609EDB] hover:bg-[#4a8acb] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#609EDB] transition-colors shadow-lg"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              className="font-medium text-[#609EDB] hover:text-[#4a8acb] transition-colors"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError('')
              }}
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>

        <div className="text-center mt-8">
          <p className="text-[#4A5568] italic">
            "The only true wisdom is in knowing you know nothing"
          </p>
          <p className="text-[#609EDB] text-sm mt-1">- Socrates</p>
        </div>
      </div>
    </div>
  )
}