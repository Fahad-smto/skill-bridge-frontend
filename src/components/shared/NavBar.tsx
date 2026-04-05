// components/shared/NavBar.tsx
'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, X, GraduationCap, LogOut, LayoutDashboard, User } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Browse Tutors', href: '/tutors' },
  { label: 'Categories', href: '/categories' },
  { label: 'About', href: '/about-us' },
]

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // ✅ Auth state check function
  const checkAuth = () => {
    try {
      const stored = localStorage.getItem('user')
      if (stored) {
        const userData = JSON.parse(stored)
        setUser(userData)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Failed to parse user data:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Listen for storage changes (when login/register happens)
  useEffect(() => {
    checkAuth()
    
    // Listen for localStorage changes (for cross-tab sync)
    window.addEventListener('storage', checkAuth)
    
    // Custom event for login/register
    window.addEventListener('authChange', checkAuth)
    
    return () => {
      window.removeEventListener('storage', checkAuth)
      window.removeEventListener('authChange', checkAuth)
    }
  }, [])

  // ✅ Also check when pathname changes (navigation)
  useEffect(() => {
    checkAuth()
  }, [pathname])

  const getDashboardRoute = () => {
    if (user?.role === 'ADMIN') return '/dashboard/admin'
    if (user?.role === 'TUTOR') return '/dashboard/tutor'
    return '/dashboard/student'
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    
    // ✅ Dispatch custom event to update other components
    window.dispatchEvent(new Event('authChange'))
    
    router.push('/')
    setIsOpen(false)
  }

  if (isLoading) {
    return (
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                SkillBridge
              </span>
            </Link>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <GraduationCap className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              SkillBridge
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  </div>
                  <Button variant="ghost" asChild className="text-gray-600 hover:text-blue-600">
                    <Link href={getDashboardRoute()}>
                      <LayoutDashboard className="w-4 h-4 mr-1" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="text-gray-600 hover:text-blue-600">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="pt-3 mt-2 border-t border-gray-100">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500 capitalize">{user.role?.toLowerCase()}</div>
                    </div>
                  </div>
                  <Link
                    href={getDashboardRoute()}
                    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 mt-1 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}