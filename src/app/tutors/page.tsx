'use client'

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from 'next/navigation'
import Link from "next/link"

const categories = [
  "All", "Mathematics", "Programming",
  "Science", "English", "Music", "Design", "Business"
]

const badgeColors: Record<string, string> = {
  "Top Rated": "bg-amber-100 text-amber-700",
  "Popular": "bg-blue-100 text-blue-700",
  "Expert": "bg-purple-100 text-purple-700",
  "Rising Star": "bg-green-100 text-green-700",
}

// ─────────────────────────────────────────
// Main Content Component
// ─────────────────────────────────────────
function TutorsContent() {
  const searchParams = useSearchParams()
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("rating")
  const [maxRate, setMaxRate] = useState(1000)
  const [tutors, setTutors] = useState<{ id: string; user?: { name: string }; location: string; bio: string; experience: number; totalReviews: number; avgRating: number; hourlyRate: number; isApproved: boolean }[]>([])
  const [loading, setLoading] = useState(true)

  // URL থেকে category পড়ো
  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setSelectedCategory(cat)
  }, [searchParams])

  // API call
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tutor`
        )
        const data = await res.json()
        setTutors(data.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchTutors()
  }, [])

  // ← filtered এখানে component এর ভেতরে আছে ✅
  const filtered = tutors
    .filter((t: { user?: { name: string }; bio: string; hourlyRate: number }) => {
      const matchSearch =
        t.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        t.bio?.toLowerCase().includes(search.toLowerCase())
      const matchRate = t.hourlyRate <= maxRate
      return matchSearch && matchRate
    })
    .sort((a: { avgRating: number; hourlyRate: number; totalReviews: number }, b: { avgRating: number; hourlyRate: number; totalReviews: number }) => {
      if (sortBy === "rating") return b.avgRating - a.avgRating
      if (sortBy === "price_low") return a.hourlyRate - b.hourlyRate
      if (sortBy === "price_high") return b.hourlyRate - a.hourlyRate
      if (sortBy === "reviews") return b.totalReviews - a.totalReviews
      return 0
    })

  // ← return এখানে component এর ভেতরে আছে ✅
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 py-14 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-white/70 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
            {tutors.filter((t: { isApproved: boolean }) => t.isApproved).length} tutors available now
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Find Your Perfect{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Tutor
            </span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Browse verified tutors, check availability, and book your first session today.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mt-6 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search by name or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Filters */}
          <aside className="lg:w-64 space-y-6 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
              <h3 className="font-semibold text-gray-900">Filters</h3>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Category
                </label>
                <div className="flex flex-col gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-left text-sm px-3 py-2 rounded-lg transition-all ${
                        selectedCategory === cat
                          ? "bg-zinc-900 text-white font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Rate */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Max Rate: ৳{maxRate}/hr
                </label>
                <input
                  type="range"
                  min={200}
                  max={1000}
                  step={50}
                  value={maxRate}
                  onChange={(e) => setMaxRate(Number(e.target.value))}
                  className="w-full accent-zinc-900"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>৳200</span>
                  <span>৳1000</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-5">

            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {filtered.length}
                </span>{" "}
                tutors
                {selectedCategory !== "All" && (
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className="ml-2 bg-zinc-900 text-white text-xs px-2 py-0.5 rounded-full"
                  >
                    {selectedCategory} ✕
                  </button>
                )}
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none"
              >
                <option value="rating">Top Rated</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="reviews">Most Reviews</option>
              </select>
            </div>

            {/* Loading Skeleton */}
            {loading && (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-gray-100 h-64 animate-pulse"
                  />
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && filtered.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                <div className="text-5xl mb-4">😔</div>
                <p className="text-lg font-medium">No tutors found</p>
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="mt-4 text-sm text-blue-600 hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}

            {/* Tutor Cards */}
            {!loading && filtered.length > 0 && (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((tutor: { id: string; user?: { name: string }; location: string; bio: string; experience: number; totalReviews: number; avgRating: number; hourlyRate: number; isApproved: boolean }) => (
                  <div
                    key={tutor.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
                  >
                    {/* Card Top */}
                    <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-5 relative">
                      <div className={`absolute top-3 right-3 flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${tutor.isApproved ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${tutor.isApproved ? "bg-green-400" : "bg-gray-400"}`} />
                        {tutor.isApproved ? "Available" : "Unavailable"}
                      </div>
                      <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl">
                        👨‍🏫
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {tutor.user?.name}
                        </h3>
                        <p className="text-sm text-blue-600 font-medium">
                          {tutor.location}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                        {tutor.bio || "No bio available"}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>⏳ {tutor.experience}y exp</span>
                        <span>💬 {tutor.totalReviews} reviews</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span
                            key={s}
                            className={`text-sm ${s <= Math.round(tutor.avgRating) ? "text-amber-400" : "text-gray-200"}`}
                          >★</span>
                        ))}
                        <span className="text-sm font-semibold text-gray-900">
                          {tutor.avgRating?.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div>
                          <span className="text-lg font-bold text-gray-900">
                            ৳{tutor.hourlyRate}
                          </span>
                          <span className="text-xs text-gray-400">/hr</span>
                        </div>
                        <Link
                          href={`/tutors/${tutor.id}`}
                          className="bg-zinc-900 hover:bg-zinc-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// Export with Suspense
// ─────────────────────────────────────────
export default function BrowseTutors() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <TutorsContent />
    </Suspense>
  )
}