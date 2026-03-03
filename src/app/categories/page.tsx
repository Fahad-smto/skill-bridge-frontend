'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const categoryIcons: Record<string, string> = {
  Mathematics: '📐',
  Programming: '💻',
  English: '📖',
  Science: '🔬',
  History: '🏛️',
  Music: '🎵',
  Design: '🎨',
  Business: '💼',
}

const categoryColors: Record<string, string> = {
  Mathematics: 'from-blue-500 to-indigo-600',
  Programming: 'from-emerald-500 to-teal-600',
  English: 'from-amber-500 to-orange-600',
  Science: 'from-purple-500 to-violet-600',
  History: 'from-rose-500 to-pink-600',
  Music: 'from-cyan-500 to-blue-600',
  Design: 'from-fuchsia-500 to-purple-600',
  Business: 'from-green-500 to-emerald-600',
}

const categoryBg: Record<string, string> = {
  Mathematics: 'bg-blue-50 hover:bg-blue-100',
  Programming: 'bg-emerald-50 hover:bg-emerald-100',
  English: 'bg-amber-50 hover:bg-amber-100',
  Science: 'bg-purple-50 hover:bg-purple-100',
  History: 'bg-rose-50 hover:bg-rose-100',
  Music: 'bg-cyan-50 hover:bg-cyan-100',
  Design: 'bg-fuchsia-50 hover:bg-fuchsia-100',
  Business: 'bg-green-50 hover:bg-green-100',
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState< { id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tutor/categories`
        )
        const data = await res.json()
        setCategories(data.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-white/70 text-sm">
            🎓 Explore All Subjects
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Browse by{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Category
            </span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Find expert tutors in your favourite subject and start learning today.
          </p>
        </div>
      </div>

      {/* ── Categories Grid ── */}
      <div className="max-w-6xl mx-auto px-4 py-14">

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-40 rounded-2xl bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Categories */}
        {!loading && categories.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900">
                All Categories
                <span className="ml-2 text-sm font-normal text-gray-400">
                  ({categories.length} subjects)
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {categories.map((cat: { id: string; name: string }) => (
                <Link
                  key={cat.id}
                  href={`/tutors?category=${cat.name}`}
                  className={`group relative rounded-2xl p-6 border border-transparent transition-all duration-200 cursor-pointer ${
                    categoryBg[cat.name] || 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${
                      categoryColors[cat.name] || 'from-gray-400 to-gray-600'
                    } flex items-center justify-center text-2xl shadow-md mb-4 group-hover:scale-110 transition-transform duration-200`}
                  >
                    {categoryIcons[cat.name] || cat.icon || '📚'}
                  </div>

                  {/* Name */}
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {cat.name}
                  </h3>

                  {/* Tutors count */}
                  <p className="text-xs text-gray-500 mt-1">
                    {cat._count?.tutors || 0} tutors
                  </p>

                  {/* Arrow */}
                  <div className="absolute bottom-4 right-4 w-7 h-7 rounded-full bg-white/60 flex items-center justify-center text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    →
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && categories.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-lg font-medium">No categories found</p>
            <p className="text-sm mt-1">Please run the seeder first</p>
            <code className="mt-4 inline-block bg-gray-100 text-gray-700 text-xs px-4 py-2 rounded-lg">
              npm run seed:admin
            </code>
          </div>
        )}

        {/* ── Featured Section ── */}
        {!loading && categories.length > 0 && (
          <div className="mt-16 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl p-10 text-center space-y-5">
            <h2 className="text-3xl font-bold text-white">
              Cannot find your subject?
            </h2>
            <p className="text-white/50 max-w-md mx-auto">
              Browse all tutors and filter by your specific needs. We have experts in 50+ subjects.
            </p>
            <Link
              href="/tutors"
              className="inline-flex items-center gap-2 bg-white text-zinc-900 font-semibold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors"
            >
              Browse All Tutors →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
 