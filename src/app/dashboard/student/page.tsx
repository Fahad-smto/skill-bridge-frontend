 'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Calendar, BookOpen, Star, Clock,
  LogOut, User, Search, ChevronRight,
  CheckCircle, XCircle, AlertCircle
} from 'lucide-react'

type Booking = {
  id: number
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  scheduledAt: string
  duration: number
  totalPrice: number
  tutorProfile?: {
    user?: { name: string }
    hourlyRate: number
  }
  review?: { id: number }
}

type User = {
  id: number
  name: string
  email: string
  role: string
}

const statusConfig = {
  CONFIRMED: { label: 'Upcoming', color: 'bg-blue-100 text-blue-700', icon: Clock },
  COMPLETED: { label: 'Completed', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
}

export default function StudentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'>('all')
  const [reviewModal, setReviewModal] = useState<{ bookingId: number; tutorProfileId: number } | null>(null)
  const [review, setReview] = useState({ rating: 5, comment: '' })
  const [reviewLoading, setReviewLoading] = useState(false)
  const [cancelLoading, setCancelLoading] = useState<number | null>(null)

  // ── Auth Check ──
  useEffect(() => {
    const userStr = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (!token || !userStr) { router.push('/login'); return }
    try {
      const u = JSON.parse(userStr)
      if (u.role !== 'STUDENT') { router.push('/'); return }
      setUser(u)
    } catch { router.push('/login') }
  }, [router])

  // ── Fetch Bookings ──
  useEffect(() => {
    if (!user) return
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/booking`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        )
        const data = await res.json()
        if (data.success) setBookings(data.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [user])

  // ── Cancel Booking ──
  const cancelBooking = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return
    setCancelLoading(id)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/booking/${id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ status: 'CANCELLED' }),
        }
      )
      const data = await res.json()
      if (data.success) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setCancelLoading(null) }
  }

  // ── Submit Review ──
  const submitReview = async () => {
    if (!reviewModal) return
    setReviewLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/review`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            bookingId: reviewModal.bookingId,
            tutorProfileId: reviewModal.tutorProfileId,
            rating: review.rating,
            comment: review.comment,
          }),
        }
      )
      const data = await res.json()
      if (data.success) {
        setBookings(prev => prev.map(b =>
          b.id === reviewModal.bookingId ? { ...b, review: { id: data.data.id } } : b
        ))
        setReviewModal(null)
        setReview({ rating: 5, comment: '' })
        alert('Review submitted!')
      } else {
        alert(data.message || 'Failed to submit review')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setReviewLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  // ── Filtered Bookings ──
  const filtered = activeTab === 'all'
    ? bookings
    : bookings.filter(b => b.status === activeTab)

  // ── Stats ──
  const upcoming = bookings.filter(b => b.status === 'CONFIRMED').length
  const completed = bookings.filter(b => b.status === 'COMPLETED').length
  const totalSpent = bookings
    .filter(b => b.status === 'COMPLETED')
    .reduce((s, b) => s + b.totalPrice, 0)

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Top Navbar ── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white text-sm">🎓</div>
            <span className="font-bold text-zinc-900">SkillBridge</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/tutors"
              className="flex items-center gap-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
            >
              <Search className="w-4 h-4" />
              Find Tutors
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">

        {/* ── Welcome ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-400 text-sm mt-1">Here's your learning overview</p>
          </div>
          <Link
            href="/tutors"
            className="bg-zinc-900 text-white font-medium px-5 py-2.5 rounded-xl text-sm hover:bg-zinc-700 transition-colors"
          >
            Book a Session
          </Link>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Upcoming Sessions', value: upcoming, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Completed Sessions', value: completed, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Total Spent', value: `৳${totalSpent}`, icon: BookOpen, color: 'text-violet-600', bg: 'bg-violet-50' },
          ].map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                <div className="text-gray-400 text-xs mt-1">{s.label}</div>
              </div>
            )
          })}
        </div>

        {/* ── Bookings ── */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">My Bookings</h2>
          </div>

          {/* Tabs */}
          <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-2">
            {(['all', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-zinc-900 text-white'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {tab === 'all' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
                <span className="ml-1.5 text-xs opacity-60">
                  {tab === 'all'
                    ? bookings.length
                    : bookings.filter(b => b.status === tab).length}
                </span>
              </button>
            ))}
          </div>

          {/* Booking List */}
          <div className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <div className="py-16 text-center">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-gray-400 text-sm">No bookings found</p>
                <Link
                  href="/tutors"
                  className="mt-4 inline-block text-sm text-zinc-900 font-medium hover:underline"
                >
                  Find a tutor →
                </Link>
              </div>
            ) : (
              filtered.map(booking => {
                const config = statusConfig[booking.status]
                const StatusIcon = config.icon
                return (
                  <div key={booking.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">

                      {/* Left */}
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl shrink-0">
                          👨‍🏫
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">
                            {booking.tutorProfile?.user?.name || 'Tutor'}
                          </div>
                          <div className="text-gray-400 text-xs mt-0.5">
                            {new Date(booking.scheduledAt).toLocaleDateString('en-US', {
                              weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                            })}
                            {' · '}{booking.duration} min
                            {' · '}৳{booking.totalPrice}
                          </div>
                        </div>
                      </div>

                      {/* Right */}
                      <div className="flex items-center gap-3">
                        <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${config.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {config.label}
                        </span>

                        {/* Cancel Button */}
                        {booking.status === 'CONFIRMED' && (
                          <button
                            onClick={() => cancelBooking(booking.id)}
                            disabled={cancelLoading === booking.id}
                            className="text-xs text-red-500 hover:text-red-700 font-medium border border-red-100 hover:border-red-200 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            {cancelLoading === booking.id ? '...' : 'Cancel'}
                          </button>
                        )}

                        {/* Review Button */}
                        {booking.status === 'COMPLETED' && !booking.review && (
                          <button
                            onClick={() => setReviewModal({
                              bookingId: booking.id,
                              tutorProfileId: booking.tutorProfile?.user
                                ? (booking as any).tutorProfileId
                                : 0
                            })}
                            className="text-xs text-amber-600 hover:text-amber-700 font-medium border border-amber-100 hover:border-amber-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Star className="w-3 h-3" />
                            Review
                          </button>
                        )}

                        {booking.status === 'COMPLETED' && booking.review && (
                          <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Reviewed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* ── Profile Card ── */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">My Account</h2>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-gray-900">{user?.name}</div>
              <div className="text-gray-400 text-sm">{user?.email}</div>
              <div className="text-xs text-emerald-600 font-medium mt-1">✅ Student Account</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
            <Link
              href="/tutors"
              className="flex-1 text-center bg-zinc-900 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-zinc-700 transition-colors"
            >
              Browse Tutors
            </Link>
            <button
              onClick={handleLogout}
              className="flex-1 text-center border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* ── Review Modal ── */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-full max-w-sm">
            <h3 className="font-semibold text-gray-900 mb-1">Leave a Review</h3>
            <p className="text-gray-400 text-sm mb-5">How was your session?</p>

            {/* Rating */}
            <div className="space-y-1.5 mb-4">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <button
                    key={s}
                    onClick={() => setReview(r => ({ ...r, rating: s }))}
                    className={`text-2xl transition-transform hover:scale-110 ${
                      s <= review.rating ? 'text-amber-400' : 'text-gray-200'
                    }`}
                  >
                    ★
                  </button>
                ))}
                <span className="text-sm text-gray-400 ml-2">{review.rating}/5</span>
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-1.5 mb-5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</label>
              <textarea
                value={review.comment}
                onChange={e => setReview(r => ({ ...r, comment: e.target.value }))}
                placeholder="Share your experience..."
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={submitReview}
                disabled={reviewLoading}
                className="flex-1 bg-zinc-900 text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-zinc-700 transition-colors disabled:opacity-50"
              >
                {reviewLoading ? 'Submitting...' : 'Submit Review'}
              </button>
             
            </div>
          </div>
        </div>
      )}
    </div>
  )
}