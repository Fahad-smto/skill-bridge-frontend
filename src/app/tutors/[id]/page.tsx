'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Clock, Star, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function TutorProfilePage() {
  const { id } = useParams()
  const router = useRouter()
  const [tutor, setTutor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tutor/${id}`
        )
        const data = await res.json()

        if (!data.success) {
          setError('Tutor not found')
          return
        }

        setTutor(data.data)
      } catch (err) {
        setError('Something went wrong')
      } finally {
        setLoading(false)
      }
    }
    fetchTutor()
  }, [id])

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // ── Error ──
  if (error || !tutor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-5xl">😔</div>
        <p className="text-lg font-medium text-gray-700">{error || 'Tutor not found'}</p>
        <Button onClick={() => router.push('/tutors')}>
          Back to Tutors
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 py-12 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tutors
          </button>

          <div className="flex flex-col md:flex-row gap-8 items-start">

            {/* Avatar */}
            <div className="w-24 h-24 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center text-5xl shrink-0">
              👨‍🏫
            </div>

            {/* Info */}
            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {tutor.user?.name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  {tutor.categories?.map((c: any) => (
                    <span
                      key={c.categoryId}
                      className="text-xs bg-white/10 text-white/70 border border-white/20 px-2.5 py-1 rounded-full"
                    >
                      {c.category?.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm">
                {tutor.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {tutor.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {tutor.experience} years experience
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {tutor.totalReviews} reviews
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-5 h-5 ${s <= Math.round(tutor.avgRating) ? "text-amber-400 fill-amber-400" : "text-white/20"}`}
                    />
                  ))}
                </div>
                <span className="text-white font-semibold">
                  {tutor.avgRating?.toFixed(1)}
                </span>
                <span className="text-white/40 text-sm">
                  ({tutor.totalReviews} reviews)
                </span>
              </div>
            </div>

            {/* Price + Book */}
            <div className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center shrink-0 w-full md:w-48">
              <div className="text-3xl font-bold text-white">
                ৳{tutor.hourlyRate}
              </div>
              <div className="text-white/50 text-sm mb-4">per hour</div>
              <Button className="w-full bg-white text-zinc-900 hover:bg-white/90">
                Book Session
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">

        {/* Left Column */}
        <div className="md:col-span-2 space-y-6">

          {/* Bio */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-3">About</h2>
            <p className="text-gray-600 leading-relaxed">
              {tutor.bio || 'No bio available'}
            </p>
          </div>

          {/* Availability */}
          {tutor.availability?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Availability</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {tutor.availability.map((slot: any) => (
                  <div
                    key={slot.id}
                    className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100"
                  >
                    <div className="font-medium text-gray-900 text-sm">
                      {dayNames[slot.dayOfWeek]}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {slot.startTime} - {slot.endTime}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">
              Reviews ({tutor.totalReviews})
            </h2>
            {tutor.reviews?.length > 0 ? (
              <div className="space-y-4">
                {tutor.reviews.map((review: any) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-100 pb-4 last:border-0"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold">
                        {review.student?.name?.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {review.student?.name}
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span
                              key={s}
                              className={`text-xs ${s <= review.rating ? "text-amber-400" : "text-gray-200"}`}
                            >★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No reviews yet</p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">

          {/* Quick Info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <h3 className="font-semibold text-gray-900">Quick Info</h3>
            {[
              { label: 'Hourly Rate', value: `৳${tutor.hourlyRate}` },
              { label: 'Experience', value: `${tutor.experience} years` },
              { label: 'Total Reviews', value: tutor.totalReviews },
              { label: 'Rating', value: `${tutor.avgRating?.toFixed(1)} / 5` },
              { label: 'Status', value: tutor.isApproved ? '✅ Available' : '❌ Unavailable' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between text-sm">
                <span className="text-gray-500">{item.label}</span>
                <span className="font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Book CTA */}
          <div className="bg-zinc-900 rounded-2xl p-5 text-center space-y-3">
            <div className="text-white font-semibold">Ready to learn?</div>
            <div className="text-white/50 text-xs">
              Book a session with {tutor.user?.name}
            </div>
            <Button className="w-full bg-white text-zinc-900 hover:bg-white/90">
              Book Now
            </Button>
            <Link
              href="/tutors"
              className="block text-white/40 text-xs hover:text-white/60 transition-colors"
            >
              Browse other tutors
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}