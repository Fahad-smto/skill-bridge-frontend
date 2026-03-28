// app/dashboard/student/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Star, 
  TrendingUp,
  User,
  MessageSquare,
  Settings,
  LogOut
} from 'lucide-react'

interface IUser {
  id: number
  name: string
  email: string
  role: string
}

export default function StudentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<IUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    
    if (!token || !userStr) {
      router.push('/login')
      return
    }
    
    try {
      const parsedUser = JSON.parse(userStr)
      
      // Check if user is student
      if (parsedUser.role !== 'STUDENT') {
        if (parsedUser.role === 'ADMIN') {
          router.push('/dashboard/admin')
        } else if (parsedUser.role === 'TUTOR') {
          router.push('/dashboard/tutor')
        } else {
          router.push('/')
        }
        return
      }
      
      setUser(parsedUser)
    } catch (error) {
      console.error('Failed to parse user:', error)
      router.push('/login')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Sample data (replace with actual API data)
  const stats = [
    { label: 'Active Tutors', value: '3', icon: BookOpen, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Hours Learned', value: '24.5', icon: Clock, color: 'text-green-600', bgColor: 'bg-green-50' },
    { label: 'Upcoming Sessions', value: '2', icon: Calendar, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { label: 'Average Rating', value: '4.8', icon: Star, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  ]

  const recentSessions = [
    { id: 1, subject: 'Mathematics', tutor: 'Rahim Ahmed', date: 'Today, 4:00 PM', duration: '1 hour', status: 'Upcoming' },
    { id: 2, subject: 'Physics', tutor: 'Karim Hasan', date: 'Tomorrow, 5:30 PM', duration: '1.5 hours', status: 'Scheduled' },
    { id: 3, subject: 'English', tutor: 'Fatema Begum', date: 'Mar 25, 2024', duration: '1 hour', status: 'Completed' },
  ]

  const recommendedTutors = [
    { id: 1, name: 'Dr. Rahman', subject: 'Mathematics', rating: 4.9, price: 25, image: '👨‍🏫' },
    { id: 2, name: 'Prof. Karim', subject: 'Physics', rating: 4.8, price: 30, image: '👨‍🔬' },
    { id: 3, name: 'Ms. Sultana', subject: 'English', rating: 4.9, price: 20, image: '👩‍🏫' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Student Dashboard</h1>
              <p className="text-blue-100 mt-1">
                Welcome back, {user.name}! Ready to learn something new?
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                <User className="w-4 h-4" />
                <span className="text-sm">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className={`${stat.bgColor} rounded-xl p-6 border border-gray-100 shadow-sm`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </div>
            )
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Recent Sessions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Sessions</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {recentSessions.map((session) => (
                  <div key={session.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{session.subject}</h3>
                        <p className="text-sm text-gray-600 mt-1">with {session.tutor}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {session.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {session.duration}
                          </span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        session.status === 'Upcoming' 
                          ? 'bg-green-100 text-green-700'
                          : session.status === 'Scheduled'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <Link 
                  href="/dashboard/student/sessions" 
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All Sessions →
                </Link>
              </div>
            </div>

            {/* Learning Progress */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Mathematics</span>
                    <span className="text-gray-600">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Physics</span>
                    <span className="text-gray-600">60%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">English</span>
                    <span className="text-gray-600">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Recommended Tutors */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recommended Tutors</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {recommendedTutors.map((tutor) => (
                  <div key={tutor.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg">
                        {tutor.image}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{tutor.name}</h3>
                        <p className="text-xs text-gray-500">{tutor.subject}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600 ml-1">{tutor.rating}</span>
                          </div>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-600">${tutor.price}/hr</span>
                        </div>
                      </div>
                      <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700">
                        Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <Link 
                  href="/tutors" 
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Find More Tutors →
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Find the perfect tutor for your learning journey
              </p>
              <Link
                href="/tutors"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Browse Tutors
                <BookOpen className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
