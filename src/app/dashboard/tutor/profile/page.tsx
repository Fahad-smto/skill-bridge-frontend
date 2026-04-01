'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Category = { id: number; name: string; icon: string }

export default function TutorProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [hasProfile, setHasProfile] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [profile, setProfile] = useState({
    bio: '',
    hourlyRate: '',
    experience: '',
    location: '',
    imageUrl: '',
  })

  useEffect(() => {
    fetchCategories()
    checkExistingProfile()
  }, [])

  // Categories fetch করো
  const fetchCategories = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tutor/categories`
      )
      const data = await res.json()
      setCategories(data.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  // Existing profile check করো
  const checkExistingProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) { router.push('/login'); return }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tutor/me`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )

      const data = await res.json()

      if (data.success && data.data) {
        setHasProfile(true)
        setProfile({
          bio: data.data.bio || '',
          hourlyRate: data.data.hourlyRate || '',
          experience: data.data.experience || '',
          location: data.data.location || '',
          imageUrl: data.data.imageUrl || '',
        })
        // Existing categories set করো
        const catIds = data.data.categories?.map((c: any) => c.categoryId) || []
        setSelectedCategories(catIds)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsFetching(false)
    }
  }

  // Category toggle
  const toggleCategory = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('token')
      if (!token) { router.push('/login'); return }

      if (selectedCategories.length === 0) {
        setError('Please select at least one category')
        setIsLoading(false)
        return
      }

      const body = {
        bio: profile.bio,
        hourlyRate: Number(profile.hourlyRate),
        experience: Number(profile.experience),
        location: profile.location,
        imageUrl: profile.imageUrl || undefined,
        categoryIds: selectedCategories, // ✅ categoryIds পাঠাচ্ছি
      }

      // ✅ Profile আছে → PUT, নেই → POST
      const method = hasProfile ? 'PUT' : 'POST'
      const url = hasProfile
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tutor/me`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tutor`

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (data.success) {
        setSuccess(hasProfile ? 'Profile updated!' : 'Profile created!')
        setHasProfile(true)

        // Categories update করো
        if (hasProfile) {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tutor/categories`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({ categoryIds: selectedCategories }),
            }
          )
        }

        setTimeout(() => router.push('/dashboard/tutor'), 1000)
      } else {
        setError(data.message || 'Failed')
      }
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {hasProfile ? 'Update Profile' : 'Create Tutor Profile'}
        </h1>
        <p className="text-gray-500 mb-8 text-sm">
          {hasProfile ? 'Update your tutor profile' : 'Create your profile to start teaching'}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Bio */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-900">Bio *</label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Tell students about yourself..."
              rows={4}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm resize-none"
            />
          </div>

          {/* Rate + Experience */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-900">Rate (৳/hr) *</label>
              <input
                type="number"
                value={profile.hourlyRate}
                onChange={(e) => setProfile({ ...profile, hourlyRate: e.target.value })}
                placeholder="500"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-900">Experience (yrs) *</label>
              <input
                type="number"
                value={profile.experience}
                onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                placeholder="3"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-900">Location *</label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              placeholder="Dhaka, Bangladesh"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm"
            />
          </div>

          {/* Image URL */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-900">Profile Image URL</label>
            <input
              type="url"
              value={profile.imageUrl}
              onChange={(e) => setProfile({ ...profile, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm"
            />
          </div>

          {/* ✅ Category Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Subjects you teach *
              <span className="text-gray-400 font-normal ml-1">(select all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all ${
                    selectedCategories.includes(cat.id)
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : 'border-gray-200 text-gray-600 hover:border-zinc-400'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
            {selectedCategories.length === 0 && (
              <p className="text-xs text-red-400">Please select at least one subject</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-zinc-900 hover:bg-zinc-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 text-sm"
            >
              {isLoading
                ? 'Saving...'
                : hasProfile ? 'Update Profile' : 'Create Profile'
              }
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard/tutor')}
              className="px-6 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-2.5 rounded-lg transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}