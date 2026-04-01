'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRoleAccess } from '@/hooks/useRoleAccess'
import { IUser, IBooking, ICategory, IStats } from '@/types/admin.types'
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  UserCheck,
  Calendar,
  Tag,
  AlertCircle,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

export default function AdminDashboard() {
  const { user, isAuthorized, isLoading: authLoading } = useRoleAccess(['ADMIN']);
  
  const [users, setUsers] = useState<IUser[]>([])
  const [bookings, setBookings] = useState<IBooking[]>([])
  const [categories, setCategories] = useState<ICategory[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'bookings' | 'categories'>('overview')
  const [newCategory, setNewCategory] = useState({ name: '', icon: '' })
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  // ─────────────────────────────────────────
  // Fetch All Data
  // ─────────────────────────────────────────
  useEffect(() => {
    if (!isAuthorized) return;
    
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
  }, [isAuthorized])

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
    { 
      label: 'Total Students', 
      value: totalStudents, 
      icon: Users, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100'
    },
    { 
      label: 'Total Tutors', 
      value: totalTutors, 
      icon: UserCheck, 
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100'
    },
    { 
      label: 'Total Bookings', 
      value: totalBookings, 
      icon: Calendar, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100'
    },
    { 
      label: 'Total Revenue', 
      value: `৳${totalRevenue.toLocaleString()}`, 
      icon: DollarSign, 
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100'
    },
  ]

  const tabs = [
    { key: 'overview', label: 'Overview', icon: TrendingUp },
    { key: 'users', label: 'Users', icon: Users },
    { key: 'bookings', label: 'Bookings', icon: Calendar },
    { key: 'categories', label: 'Categories', icon: Tag },
  ]

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  }

  // Filter users based on search
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Loading state
  if (authLoading || (loading && activeTab !== 'overview')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-blue-100 text-sm mt-1">
                Welcome back, {user?.name}! Manage your platform with ease.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </button>
              <Link
                href="/"
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Back to Site
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* ── Tabs ── */}
        <div className="flex flex-wrap items-center gap-2 bg-white rounded-xl shadow-sm p-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {!loading ? (
          <>
            {/* ── Overview Tab ── */}
            {activeTab === 'overview' && (
              <div className="space-y-8">

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div
                        key={stat.label}
                        className={`${stat.bgColor} border ${stat.borderColor} rounded-xl p-6 hover:shadow-lg transition-shadow`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className={`${stat.color} p-2 bg-white rounded-lg shadow-sm`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <TrendingUp className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className={`text-2xl font-bold text-gray-900`}>{stat.value}</div>
                        <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <Shield className="w-5 h-5 text-red-500" />
                      <span className="text-xs text-gray-500">Banned Accounts</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600">{totalBanned}</div>
                    <p className="text-xs text-gray-500 mt-2">
                      {((totalBanned / users.length) * 100).toFixed(1)}% of total users
                    </p>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <BookOpen className="w-5 h-5 text-green-500" />
                      <span className="text-xs text-gray-500">Completed Sessions</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{completedBookings}</div>
                    <p className="text-xs text-gray-500 mt-2">
                      {((completedBookings / totalBookings) * 100).toFixed(1)}% completion rate
                    </p>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <Tag className="w-5 h-5 text-purple-500" />
                      <span className="text-xs text-gray-500">Categories</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">{categories.length}</div>
                    <p className="text-xs text-gray-500 mt-2">Available subjects</p>
                  </div>
                </div>

                {/* Recent Bookings */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Recent Bookings</h3>
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View all →
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
                        {bookings.slice(0, 5).map((b) => (
                          <tr key={b.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">
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
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                      <Filter className="w-4 h-4" />
                      Filter
                    </button>
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">
                      All Users ({filteredUsers.length})
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
                        {currentUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                                  {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-medium text-gray-900">{user.name}</span>
                              </div>
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
                                  {actionLoading === user.id ? '...' : user.isBanned ? 'Unban' : 'Ban'}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} users
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm text-gray-600">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Bookings Tab ── */}
            {activeTab === 'bookings' && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">
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
                      {bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">
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
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Add New Category</h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Category name (e.g. Physics)"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Icon (e.g. ⚛️)"
                      value={newCategory.icon}
                      onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                      className="w-32 px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={createCategory}
                      className="bg-blue-600 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      + Add Category
                    </button>
                  </div>
                </div>

                {/* Categories List */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">
                      All Categories ({categories.length})
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{cat.icon || '📚'}</span>
                          <div>
                            <div className="font-medium text-gray-900">{cat.name}</div>
                            <div className="text-xs text-gray-500">
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
        ) : (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Loading dashboard data...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}