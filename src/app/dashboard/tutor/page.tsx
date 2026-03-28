// app/dashboard/tutor/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Star, 
  Users,
  TrendingUp,
  Settings,
  BookOpen,
  MessageSquare,
  CheckCircle,
  XCircle,
  Edit,
  Eye,
  ChevronRight
} from 'lucide-react'

interface ITutorUser {
  id: number;
  name: string;
  email: string;
  role: string;
  profile?: ITutorProfile;
}

interface ITutorProfile {
  id: number;
  bio: string;
  hourlyRate: number;
  subjects: string[];
  rating: number;
  totalSessions: number;
  isAvailable: boolean;
}

interface IUpcomingSession {
  id: number;
  studentName: string;
  studentEmail: string;
  subject: string;
  date: string;
  time: string;
  duration: number;
  status: string;
}

export default function TutorDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<ITutorUser | null>(null)
  const [profile, setProfile] = useState<ITutorProfile | null>(null)
  const [upcomingSessions, setUpcomingSessions] = useState<IUpcomingSession[]>([])
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalEarnings: 0,
    totalSessions: 0,
    completedSessions: 0,
    upcomingSessions: 0,
    averageRating: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'availability' | 'reviews'>('overview')
  const [availability, setAvailability] = useState<any[]>([])

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    
    if (!token || !userStr) {
      router.push('/login')
      return
    }
    
    try {
      const parsedUser = JSON.parse(userStr)
      
      // Check if user is tutor
      if (parsedUser.role !== 'TUTOR') {
        if (parsedUser.role === 'ADMIN') {
          router.push('/dashboard/admin')
        } else if (parsedUser.role === 'STUDENT') {
          router.push('/dashboard/student')
        } else {
          router.push('/')
        }
        return
      }
      
      setUser(parsedUser)
      
      // Fetch tutor data
      fetchTutorData(parsedUser.id)
      
    } catch (error) {
      console.error('Failed to parse user:', error)
      router.push('/login')
    }
  }, [router])

  const fetchTutorData = async (userId: number) => {
    try {
      const token = localStorage.getItem('token')
      
      // Fetch tutor profile
      const profileRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tutor/profile`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      const profileData = await profileRes.json()
      
      if (profileData.success) {
        setProfile(profileData.data)
        
        // Update stats based on profile
        setStats(prev => ({
          ...prev,
          totalSessions: profileData.data.totalSessions || 0,
          averageRating: profileData.data.rating || 0
        }))
      }
      
      // Fetch upcoming sessions
      const sessionsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tutor/sessions?status=upcoming`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      const sessionsData = await sessionsRes.json()
      
      if (sessionsData.success) {
        setUpcomingSessions(sessionsData.data || [])
        setStats(prev => ({
          ...prev,
          upcomingSessions: sessionsData.data?.length || 0
        }))
      }
      
      // Fetch earnings and other stats
      const statsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tutor/stats`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      const statsData = await statsRes.json()
      
      if (statsData.success) {
        setStats(prev => ({
          ...prev,
          totalEarnings: statsData.data.totalEarnings || 0,
          totalStudents: statsData.data.totalStudents || 0,
          completedSessions: statsData.data.completedSessions || 0
        }))
      }
      
      // Fetch availability
      const availRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tutor/availability`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      const availData = await availRes.json()
      
      if (availData.success) {
        setAvailability(availData.data || [])
      }
      
    } catch (error) {
      console.error('Failed to fetch tutor data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleAvailability = async () => {
    if (!profile) return
    
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tutor/availability/toggle`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            isAvailable: !profile.isAvailable
          })
        }
      )
      
      const data = await res.json()
      if (data.success) {
        setProfile({ ...profile, isAvailable: !profile.isAvailable })
      }
    } catch (error) {
      console.error('Failed to toggle availability:', error)
    }
  }

  const updateSessionStatus = async (sessionId: number, status: string) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tutor/sessions/${sessionId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status })
        }
      )
      
      const data = await res.json()
      if (data.success) {
        // Refresh sessions
        fetchTutorData(user!.id)
      }
    } catch (error) {
      console.error('Failed to update session:', error)
    }
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

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">Please complete your tutor profile to continue</p>
          <Link
            href="/dashboard/tutor/profile"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Edit className="w-4 h-4" />
            Create Profile
          </Link>
        </div>
      </div>
    )
  }

  const statsCards = [
    {
      label: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%'
    },
    {
      label: 'Total Earnings',
      value: `৳${stats.totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+8%'
    },
    {
      label: 'Total Sessions',
      value: stats.totalSessions,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+5%'
    },
    {
      label: 'Rating',
      value: `${stats.averageRating.toFixed(1)}`,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      suffix: '/5',
      change: '+0.2'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold">Tutor Dashboard</h1>
              <p className="text-purple-100 mt-1">
                Welcome back, {user.name}! Here's what's happening with your teaching
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleAvailability}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  profile.isAvailable
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-gray-500 hover:bg-gray-600'
                }`}
              >
                {profile.isAvailable ? '✓ Available' : '✗ Unavailable'}
              </button>
              <Link
                href="/dashboard/tutor/profile"
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className={`${stat.bgColor} rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                  {stat.suffix && <span className="text-sm ml-1">{stat.suffix}</span>}
                </div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </div>
            )
          })}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'overview', label: 'Overview', icon: TrendingUp },
                { key: 'sessions', label: 'Sessions', icon: Calendar },
                { key: 'availability', label: 'Availability', icon: Clock },
                { key: 'reviews', label: 'Reviews', icon: Star }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                      activeTab === tab.key
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Teaching Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Sessions</span>
                      <span className="font-semibold text-gray-900">{stats.totalSessions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Completed Sessions</span>
                      <span className="font-semibold text-green-600">{stats.completedSessions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Upcoming Sessions</span>
                      <span className="font-semibold text-blue-600">{stats.upcomingSessions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Students</span>
                      <span className="font-semibold text-purple-600">{stats.totalStudents}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Subjects</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.subjects.map((subject, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Upcoming Sessions Preview */}
              {upcomingSessions.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h3>
                    <button
                      onClick={() => setActiveTab('sessions')}
                      className="text-sm text-purple-600 hover:text-purple-700"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {upcomingSessions.slice(0, 3).map((session) => (
                      <div key={session.id} className="px-6 py-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{session.studentName}</p>
                            <p className="text-sm text-gray-600">{session.subject}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {session.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {session.time} ({session.duration} min)
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateSessionStatus(session.id, 'COMPLETED')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Mark as Completed"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateSessionStatus(session.id, 'CANCELLED')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Cancel Session"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sessions Tab */}
          {activeTab === 'sessions' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">All Sessions</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {upcomingSessions.length > 0 ? (
                  upcomingSessions.map((session) => (
                    <div key={session.id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <Users className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{session.studentName}</p>
                              <p className="text-sm text-gray-500">{session.studentEmail}</p>
                              <p className="text-sm text-purple-600 mt-1">{session.subject}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">{session.date}</p>
                          <p className="text-sm text-gray-500">{session.time}</p>
                          <p className="text-xs text-gray-400 mt-1">{session.duration} minutes</p>
                        </div>
                        <div className="ml-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            session.status === 'CONFIRMED'
                              ? 'bg-green-100 text-green-700'
                              : session.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {session.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-12 text-center">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No sessions scheduled yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      When students book sessions, they'll appear here
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Availability Tab */}
          {activeTab === 'availability' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Weekly Schedule</h3>
                <Link
                  href="/dashboard/tutor/availability"
                  className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  Edit Schedule
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => {
                  const slot = availability.find((a: any) => a.dayOfWeek === index)
                  return (
                    <div key={day} className="border border-gray-200 rounded-lg p-4">
                      <div className="font-medium text-gray-900 mb-2">{day}</div>
                      {slot ? (
                        <div className="text-sm text-gray-600">
                          <div>{slot.startTime} - {slot.endTime}</div>
                          {slot.isRecurring && (
                            <span className="text-xs text-green-600">Recurring weekly</span>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400">Not available</div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Student Reviews</h3>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</span>
                    <span className="text-gray-500">/ 5.0</span>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {/* Sample reviews - replace with actual data */}
                <div className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-bold">R</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Rahim Ahmed</p>
                          <div className="flex items-center gap-1 mt-1">
                            {[1,2,3,4,5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= 5
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">2 days ago</span>
                      </div>
                      <p className="text-gray-600 mt-2">
                        Excellent tutor! Very patient and explains concepts clearly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}