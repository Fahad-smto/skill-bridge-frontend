// app/tutors/[id]/page.tsx (Client Component)
'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { X } from 'lucide-react'

type Tutor = {
  id: number
  user?: { name: string; email: string }
  location: string
  bio: string
  experience: number
  totalReviews: number
  avgRating: number
  hourlyRate: number
  isApproved: boolean
  categories?: { category: { name: string } }[]
}

export default function TutorDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // ✅ React.use() দিয়ে Promise unwrap করুন
  const { id } = use(params)
  
  const router = useRouter()
  const [tutor, setTutor] = useState<Tutor | null>(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBooking, setIsBooking] = useState(false)
  const [bookingMessage, setBookingMessage] = useState('')
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    duration: 60,
    note: ''
  })

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tutor/${id}`
        )
        const data = await res.json()
        setTutor(data.data)
      } catch (error) {
        console.error('Error fetching tutor:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTutor()
  }, [id])

  // Handle book click
  const handleBookClick = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Please login first to book a session')
      router.push('/login')
      return
    }
    setIsModalOpen(true)
  }

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false)
    setBookingData({ date: '', time: '', duration: 60, note: '' })
    setBookingMessage('')
  }

  // Handle booking submit
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsBooking(true)
    setBookingMessage('')

    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        setBookingMessage('Please login first')
        setIsBooking(false)
        return
      }
      
      const scheduledAt = new Date(`${bookingData.date}T${bookingData.time}:00`).toISOString()
      
      const bookingPayload = {
        tutorProfileId: tutor?.id,
        scheduledAt: scheduledAt,
        duration: bookingData.duration,
        note: bookingData.note
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingPayload)
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        setBookingMessage('success')
        setTimeout(() => {
          closeModal()
          router.push('/dashboard/student')
        }, 2000)
      } else {
        setBookingMessage(data.message || 'Booking failed. Please try again.')
      }
    } catch (error) {
      console.error('Booking error:', error)
      setBookingMessage('Network error. Please try again.')
    } finally {
      setIsBooking(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tutor details...</p>
        </div>
      </div>
    )
  }

  if (!tutor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Tutor not found</p>
          <Link href="/tutors" className="text-blue-600 hover:underline mt-2 inline-block">
            Back to Tutors
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Back Button */}
        <Link href="/tutors" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          ← Back to Tutors
        </Link>

        {/* Tutor Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-300 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-4xl">
                👨‍🏫
              </div>
              <div>
                <h1 className="text-2xl font-bold">{tutor.user?.name}</h1>
                <p className="text-white/70 mt-1">{tutor.location}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <span>⭐ {tutor.avgRating?.toFixed(1)}</span>
                    <span className="text-white/70">({tutor.totalReviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>💼 {tutor.experience} years</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Bio */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">About Me</h2>
              <p className="text-gray-600 leading-relaxed">{tutor.bio || 'No bio available'}</p>
            </div>

            {/* Categories */}
            {tutor.categories && tutor.categories.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Subjects</h2>
                <div className="flex flex-wrap gap-2">
                  {tutor.categories.map((c, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {c.category?.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Price and Book Button */}
            <div className="border-t border-gray-100 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold text-gray-900">৳{tutor.hourlyRate}</span>
                  <span className="text-gray-500">/hour</span>
                </div>
                <button
                  onClick={handleBookClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Book a Session
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
    {/* Backdrop with Blur */}
    <div 
      className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm transition-opacity" 
      onClick={closeModal} 
    />

    {/* Modal Content */}
    <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300">
      
      {/* Header with Gradient Accent */}
      <div className="relative px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Book a Session</h2>
            <p className="text-sm text-gray-500">Secure your spot with the tutor</p>
          </div>
          <button
            onClick={closeModal}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
        
        {/* Tutor Quick Card */}
        <div className="flex items-center gap-4 bg-zinc-900 text-white rounded-2xl p-4 mb-6 shadow-lg shadow-zinc-200">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">
            👨‍🏫
          </div>
          <div>
            <p className="text-xs text-white/60 uppercase tracking-wider font-medium">Tutor</p>
            <p className="text-lg font-semibold leading-tight">{tutor.user?.name}</p>
            <p className="text-sm text-blue-400">৳{tutor.hourlyRate}/hour</p>
          </div>
        </div>

        {/* Status Messages */}
        {bookingMessage === 'success' && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-xl mb-6">
            <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">✓</span>
            <p className="text-sm font-medium">Booking successful! Redirecting...</p>
          </div>
        )}

        {bookingMessage && bookingMessage !== 'success' && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl mb-6">
            <span className="flex-shrink-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">!</span>
            <p className="text-sm font-medium">{bookingMessage}</p>
          </div>
        )}

        <form onSubmit={handleBookingSubmit} className="space-y-5">
          
          {/* Date & Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">Date</label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={bookingData.date}
                onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-gray-50/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">Time</label>
              <input
                type="time"
                required
                value={bookingData.time}
                onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-gray-50/50"
              />
            </div>
          </div>

          {/* Duration Selector */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 ml-1">Duration</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[30, 60, 90, 120].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setBookingData({...bookingData, duration: mins})}
                  className={`py-2 text-sm font-medium rounded-lg border transition-all ${
                    bookingData.duration === mins 
                    ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200" 
                    : "bg-white border-gray-200 text-gray-600 hover:border-blue-300"
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          {/* Note Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 ml-1">Message for Tutor</label>
            <textarea
              rows={3}
              value={bookingData.note}
              onChange={(e) => setBookingData({...bookingData, note: e.target.value})}
              placeholder="E.g. I need help with Algebra..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-gray-50/50 resize-none"
            />
          </div>

          {/* Price Summary Section */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-blue-800 font-medium italic">Estimated Cost</div>
              <div className="text-right">
                <span className="text-2xl font-black text-blue-700">
                  ৳{Math.round(tutor.hourlyRate * (bookingData.duration / 60))}
                </span>
                <span className="text-xs text-blue-500 block">Total amount</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={isBooking}
              className="flex-[2] bg-zinc-900 text-white py-4 rounded-2xl font-bold hover:bg-zinc-800 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all shadow-xl shadow-zinc-200"
            >
              {isBooking ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : 'Confirm Booking'}
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-200 active:scale-95 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}
    </div>
  )
}