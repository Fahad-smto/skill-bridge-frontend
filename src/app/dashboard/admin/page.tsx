'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'bookings' | 'categories'>('overview')
  const [newCategory, setNewCategory] = useState({ name: '', icon: '' })
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  // ─────────────────────────────────────────
  // Fetch All Data
  // ─────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [uRes, bRes, cRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/users`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/bookings`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/categories`, { headers }),
        ])
        const [uData, bData, cData] = await Promise.all([
          uRes.json(), bRes.json(), cRes.json()
        ])
        setUsers(uData.data || [])
        setBookings(bData.data || [])
        setCategories(cData.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  // ─────────────────────────────────────────
  // Ban / Unban User
  // ─────────────────────────────────────────
  const toggleBan = async (userId: number, isBanned: boolean) => {
    setActionLoading(userId)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/users/${userId}`,
        {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ isBanned: !isBanned }),
        }
      )
      const data = await res.json()
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => u.id === userId ? { ...u, isBanned: !isBanned } : u)
        )
      }
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(null)
    }
  }

  // ─────────────────────────────────────────
  // Create Category
  // ─────────────────────────────────────────
  const createCategory = async () => {
    if (!newCategory.name) return
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/categories`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(newCategory),
        }
      )
      const data = await res.json()
      if (data.success) {
        setCategories((prev) => [...prev, data.data])
        setNewCategory({ name: '', icon: '' })
      }
    } catch (err) {
      console.error(err)
    }
  }

  // ─────────────────────────────────────────
  // Delete Category
  // ─────────────────────────────────────────
  const deleteCategory = async (categoryId: number) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/categories/${categoryId}`,
        { method: 'DELETE', headers }
      )
      const data = await res.json()
      if (data.success) {
        setCategories((prev) => prev.filter((c) => c.id !== categoryId))
      }
    } catch (err) {
      console.error(err)
    }
  }

  // ─────────────────────────────────────────
  // Stats
  // ─────────────────────────────────────────
  const totalStudents = users.filter((u) => u.role === 'STUDENT').length
  const totalTutors = users.filter((u) => u.role === 'TUTOR').length
  const totalBanned = users.filter((u) => u.isBanned).length
  const totalBookings = bookings.length
  const completedBookings = bookings.filter((b) => b.status === 'COMPLETED').length
  const totalRevenue = bookings
    .filter((b) => b.status === 'COMPLETED')
    .reduce((sum, b) => sum + b.totalPrice, 0)

  const stats = [
    { label: 'Total Students', value: totalStudents, emoji: '👨‍🎓', color: 'bg-blue-50 border-blue-100' },
    { label: 'Total Tutors', value: totalTutors, emoji: '👨‍🏫', color: 'bg-emerald-50 border-emerald-100' },
    { label: 'Total Bookings', value: totalBookings, emoji: '📅', color: 'bg-purple-50 border-purple-100' },
    { label: 'Total Revenue', value: `৳${totalRevenue}`, emoji: '💰', color: 'bg-amber-50 border-amber-100' },
  ]

  const tabs = [
    { key: 'overview', label: 'Overview', emoji: '📊' },
    { key: 'users', label: 'Users', emoji: '👥' },
    { key: 'bookings', label: 'Bookings', emoji: '📅' },
    { key: 'categories', label: 'Categories', emoji: '🏷️' },
  ]

  const statusColors: Record<string, string> = {
    CONFIRMED: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ── */}
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-white/50 text-sm mt-1">Manage your platform</p>
          </div>
          <Link
            href="/"
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            ← Back to Site
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* ── Tabs ── */}
        <div className="flex items-center gap-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-zinc-900 text-white'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <span>{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && (
          <>
            {/* ── Overview Tab ── */}
            {activeTab === 'overview' && (
              <div className="space-y-8">

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className={`rounded-2xl border p-6 ${stat.color}`}
                    >
                      <div className="text-3xl mb-3">{stat.emoji}</div>
                      <div className="text-2xl font-bold text-zinc-900">{stat.value}</div>
                      <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Extra Stats */}
                <div className="grid sm:grid-cols-3 gap-5">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
                    <div className="text-3xl font-bold text-zinc-900">{completedBookings}</div>
                    <div className="text-sm text-gray-500 mt-1">Completed Sessions</div>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
                    <div className="text-3xl font-bold text-red-500">{totalBanned}</div>
                    <div className="text-sm text-gray-500 mt-1">Banned Users</div>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
                    <div className="text-3xl font-bold text-zinc-900">{categories.length}</div>
                    <div className="text-sm text-gray-500 mt-1">Total Categories</div>
                  </div>
                </div>

                {/* Recent Bookings */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-zinc-900">Recent Bookings</h3>
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      View all
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                        <tr>
                          <th className="px-6 py-3 text-left">Student</th>
                          <th className="px-6 py-3 text-left">Tutor</th>
                          <th className="px-6 py-3 text-left">Amount</th>
                          <th className="px-6 py-3 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {bookings.slice(0, 5).map((b: any) => (
                          <tr key={b.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-zinc-900">
                              {b.student?.name}
                            </td>
                            <td className="px-6 py-4 text-gray-500">
                              {b.tutorProfile?.user?.name}
                            </td>
                            <td className="px-6 py-4 font-medium">৳{b.totalPrice}</td>
                            <td className="px-6 py-4">
                              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[b.status]}`}>
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── Users Tab ── */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-zinc-900">
                    All Users ({users.length})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                      <tr>
                        <th className="px-6 py-3 text-left">User</th>
                        <th className="px-6 py-3 text-left">Email</th>
                        <th className="px-6 py-3 text-left">Role</th>
                        <th className="px-6 py-3 text-left">Status</th>
                        <th className="px-6 py-3 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {users.map((user: any) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-zinc-900">
                            {user.name}
                          </td>
                          <td className="px-6 py-4 text-gray-500">{user.email}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                              user.role === 'ADMIN'
                                ? 'bg-purple-100 text-purple-700'
                                : user.role === 'TUTOR'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                              user.isBanned
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {user.isBanned ? 'Banned' : 'Active'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {user.role !== 'ADMIN' && (
                              <button
                                onClick={() => toggleBan(user.id, user.isBanned)}
                                disabled={actionLoading === user.id}
                                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                                  user.isBanned
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                }`}
                              >
                                {actionLoading === user.id
                                  ? '...'
                                  : user.isBanned ? 'Unban' : 'Ban'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── Bookings Tab ── */}
            {activeTab === 'bookings' && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-zinc-900">
                    All Bookings ({bookings.length})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                      <tr>
                        <th className="px-6 py-3 text-left">Student</th>
                        <th className="px-6 py-3 text-left">Tutor</th>
                        <th className="px-6 py-3 text-left">Duration</th>
                        <th className="px-6 py-3 text-left">Amount</th>
                        <th className="px-6 py-3 text-left">Date</th>
                        <th className="px-6 py-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {bookings.map((b: any ) => (
                        <tr key={b.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-zinc-900">
                            {b.student?.name}
                          </td>
                          <td className="px-6 py-4 text-gray-500">
                            {b.tutorProfile?.user?.name}
                          </td>
                          <td className="px-6 py-4 text-gray-500">
                            {b.duration} min
                          </td>
                          <td className="px-6 py-4 font-medium">৳{b.totalPrice}</td>
                          <td className="px-6 py-4 text-gray-500">
                            {new Date(b.scheduledAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[b.status]}`}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── Categories Tab ── */}
            {activeTab === 'categories' && (
              <div className="space-y-6">

                {/* Add Category */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-semibold text-zinc-900 mb-4">Add New Category</h3>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Category name (e.g. Physics)"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    />
                    <input
                      type="text"
                      placeholder="Icon (e.g. ⚛️)"
                      value={newCategory.icon}
                      onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                      className="w-32 px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    />
                    <button
                      onClick={createCategory}
                      className="bg-zinc-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-zinc-700 transition-colors"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* Categories List */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-zinc-900">
                      All Categories ({categories.length})
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {categories.map((cat: any) => (
                      <div
                        key={cat.id}
                        className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{cat.icon || '📚'}</span>
                          <div>
                            <div className="font-medium text-zinc-900">{cat.name}</div>
                            <div className="text-xs text-gray-400">
                              {cat._count?.tutors || 0} tutors
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteCategory(cat.id)}
                          className="text-xs bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}