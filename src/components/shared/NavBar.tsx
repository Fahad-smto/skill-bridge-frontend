'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, X, GraduationCap, LogOut, LayoutDashboard } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Browse Tutors', href: '/tutors' },
  { label: 'Categories', href: '/categories' },
  { label: 'About', href: '/about-us' },
]

export default function Navbar() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // ─────────────────────────────────────────
  // User check - Fixed to avoid cascading renders
  // ─────────────────────────────────────────
  useEffect(() => {
    // Use a flag to prevent state updates if component unmounts
    let isMounted = true
    
    // Use a microtask or timeout to avoid synchronous setState
    const loadUser = async () => {
      try {
        const stored = localStorage.getItem('user')
        if (stored && isMounted) {
          const parsedUser = JSON.parse(stored)
          setUser(parsedUser)
        }
      } catch (error) {
        console.error('Failed to parse user data:', error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }
    
    loadUser()
    
    // Cleanup function
    return () => {
      isMounted = false
    }
  }, []) // Empty dependency array - runs once on mount

  // Alternative approach using requestAnimationFrame (even safer)
  // useEffect(() => {
  //   const timer = requestAnimationFrame(() => {
  //     const stored = localStorage.getItem('user')
  //     if (stored) {
  //       try {
  //         setUser(JSON.parse(stored))
  //       } catch (error) {
  //         console.error('Failed to parse user data:', error)
  //       }
  //     }
  //     setIsLoading(false)
  //   })
  //   
  //   return () => {
  //     cancelAnimationFrame(timer)
  //   }
  // }, [])

  // ─────────────────────────────────────────
  // Dashboard route — role অনুযায়ী
  // ─────────────────────────────────────────
  const getDashboardRoute = () => {
    if (user?.role === 'ADMIN') return '/dashboard/admin'
    if (user?.role === 'TUTOR') return '/dashboard/tutor'
    return '/dashboard/student'
  }

  // ─────────────────────────────────────────
  // Logout
  // ─────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    router.push('/')
    setIsOpen(false) // Close mobile menu if open
  }

  // Don't render anything while checking authentication to avoid flash
  if (isLoading) {
    return (
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/50 backdrop-blur-sm rounded-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <GraduationCap className="w-7 h-7 text-primary" />
              <span>SkillBridge</span>
            </Link>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/50 backdrop-blur-sm rounded-3xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <GraduationCap className="w-7 h-7 text-primary" />
            <span>SkillBridge</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              // ✅ Logged in
              <>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-foreground">{user.name}</span>
                </div>
                <Button variant="ghost" asChild>
                  <Link href={getDashboardRoute()}>
                    <LayoutDashboard className="w-4 h-4 mr-1" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </>
            ) : (
              // ✅ Not logged in
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Register now!</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="flex flex-col gap-2 pt-3 border-t border-border">
            {user ? (
              // ✅ Mobile — Logged in
              <>
                <div className="flex items-center gap-2 py-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">{user.role?.toLowerCase()}</div>
                  </div>
                </div>
                <Button variant="outline" asChild className="w-full">
                  <Link href={getDashboardRoute()} onClick={() => setIsOpen(false)}>
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="outline" onClick={handleLogout} className="w-full">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              // ✅ Mobile — Not logged in
              <>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}