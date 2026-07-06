'use client'


import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, GraduationCap, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner' 

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Form validation
    if (!formData.name.trim()) {
      setError('Please enter your full name')
      setIsLoading(false)
      return
    }

    if (!formData.email.trim()) {
      setError('Please enter your email address')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      )

      const data = await res.json()

      // ✅ Check response structure
      if (!data.success) {
        setError(data.message || 'Registration failed')
        toast?.error(data.message || 'Registration failed')
        return
      }

      // ✅ Save token and user data (check correct path)
      // Option 1: যদি token সরাসরি data.token এ আসে
      const token = data.token || data.data?.token
      const user = data.user || data.data?.user

      if (!token || !user) {
        console.error('Invalid response structure:', data)
        setError('Invalid server response')
        return
      }

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      // ✅ Show success message
      toast?.success('Registration successful! Welcome to SkillBridge!')
      
      console.log('Successfully registered:', user)

      // ✅ Redirect based on role
      if (user.role === 'TUTOR') {
        router.push('/dashboard/tutor')
      } else if (user.role === 'STUDENT') {
        router.push('/dashboard/student')
      } else {
        router.push('/dashboard') // default dashboard
      }

    } catch (err: any ) {
      console.error('Registration error:', err)
      
      // ✅ Better error handling
      if (err.message === 'Failed to fetch') {
        setError('Unable to connect to server. Please check your internet connection.')
      } else {
        setError(err.message || 'Something went wrong. Please try again.')
      }
      
      toast?.error('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-zinc-950 flex-col justify-between p-12">

        {/* Background Grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Orbs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-blue-500/20 blur-2xl pointer-events-none" />

        {/* Logo */}
        <div className="relative flex items-center gap-2 text-white">
          <GraduationCap className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tight">SkillBridge</span>
        </div>

        {/* Center Content */}
        <div className="relative space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-white/70 text-sm">
              🎓 Join 10,000+ learners today
            </div>
           
            <p className="text-white/50 text-lg leading-relaxed max-w-sm">
              Create a free account and get instant access to 1,200+ verified tutors across 50+ subjects.
            </p>
          </div>

          {/* Feature List */}
          <div className="space-y-3">
            {[
              '✅ Free to join, no credit card required',
              '✅ Browse and book tutors instantly',
              '✅ Learn at your own pace',
              '✅ Cancel anytime',
            ].map((item) => (
              <div key={item} className="text-white/60 text-sm">
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-white/70 text-sm leading-relaxed italic">
            I found an amazing Math tutor within minutes. My grades improved drastically in just 2 months!
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-blue-400 flex items-center justify-center text-white text-xs font-bold">
              S
            </div>
            <div>
              <div className="text-white text-sm font-medium">Sadia Akter</div>
              <div className="text-white/40 text-xs">Student, Dhaka</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-7">

          {/* Header */}
          <div className="space-y-2">
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <GraduationCap className="w-7 h-7 text-primary" />
              <span className="text-xl font-bold">SkillBridge</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground tracking-tight">
              Create your account
            </h2>
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          {/* Role Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              I want to...
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { role: 'STUDENT', label: 'Learn', emoji: '👨‍🎓', desc: 'Find a tutor' },
                { role: 'TUTOR', label: 'Teach', emoji: '👨‍🏫', desc: 'Share my skills' },
              ].map((item) => (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: item.role })}
                  className={`flex flex-col items-center gap-1 p-4 rounded-xl border-2 transition-all ${
                    formData.role === item.role
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-sm font-semibold text-foreground">{item.label}</span>
                  <span className="text-xs text-muted-foreground">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Rahim Ahmed"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all text-sm"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all text-sm"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all text-sm pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Password must be at least 6 characters long
              </p>
            </div>

            {/* Terms */}
            <p className="text-xs text-muted-foreground">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-11 text-sm font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Demo Account Notice (Optional) */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              🎉 Free forever. No credit card required.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}