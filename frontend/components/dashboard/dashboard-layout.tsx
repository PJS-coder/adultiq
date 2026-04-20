'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Home,
  MessageSquare,
  Zap,
  BookOpen,
  TrendingUp,
  Trophy,
  LogOut,
  Menu,
  X,
  Brain,
  Map,
  Users,
  Clock,
  Heart,
  Scale,
  HomeIcon,
  Sun,
  Moon,
} from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
  user?: {
    id: string
    name: string
    email: string
    adultIqScore: number
  }
}

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: Home },
  { label: 'Roadmap', href: '/roadmap', icon: Map },
  { label: 'AI Coach', href: '/coach', icon: MessageSquare },
  { label: 'Simulations', href: '/simulations', icon: Zap },
  { label: 'Micro Courses', href: '/courses', icon: Clock },
  { label: 'Documents', href: '/documents', icon: BookOpen },
  { label: 'Finance', href: '/finance', icon: TrendingUp },
  { label: 'Healthcare', href: '/healthcare', icon: Heart },
  { label: 'Renting 101', href: '/renting', icon: HomeIcon },
  { label: 'Your Rights', href: '/rights', icon: Scale },
  { label: 'Community', href: '/community', icon: Users },
  { label: 'Achievements', href: '/achievements', icon: Trophy },
]

export default function DashboardLayout({
  children,
  user: propUser,
}: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(propUser)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    if (!propUser) {
      const currentUser = localStorage.getItem('currentUser')
      if (currentUser) {
        const parsed = JSON.parse(currentUser)
        setUser({
          id: parsed.id,
          name: parsed.name,
          email: parsed.email,
          adultIqScore: parsed.adultIqScore || 0,
        })
      }
    }
  }, [propUser])

  useEffect(() => {
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    } else {
      setIsDarkMode(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    if (newTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFFFF] via-[#EAF6FF] to-[#C1E5FF] dark:from-[#1A202C] dark:via-[#2D3748] dark:to-[#4A5568]">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-r border-[#EAF6FF] dark:border-gray-700 z-40 transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } shadow-lg flex flex-col`}
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-[#EAF6FF] dark:border-gray-700 flex-shrink-0">
          <Link href="/dashboard" className="flex items-center justify-center">
            <img 
              src="/logo.png" 
              alt="AdultIQ Logo" 
              className="h-12 w-auto object-contain dark:brightness-0 dark:invert"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 flex-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#6AB0E3] to-[#9CD5FF] text-white font-medium shadow-md'
                    : 'text-[#6AB0E3] dark:text-blue-400 hover:bg-[#EAF6FF] dark:hover:bg-gray-800 hover:text-[#2D3748] dark:hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Info Section - Bottom */}
        {user && (
          <div className="p-4 border-t border-[#EAF6FF] dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6AB0E3] to-[#9CD5FF] flex items-center justify-center text-white font-semibold shadow-md">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-center">
                  <p className="text-xs text-[#9CD5FF] dark:text-blue-400">Score</p>
                  <p className="text-lg font-bold text-[#6AB0E3] dark:text-blue-400">{user.adultIqScore}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="hover:bg-[#EAF6FF] dark:hover:bg-gray-800 text-[#6AB0E3] dark:text-blue-400"
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 text-[#6AB0E3] dark:text-blue-400"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg border border-[#C1E5FF] dark:border-gray-700 shadow-lg"
      >
        {sidebarOpen ? <X className="w-5 h-5 text-[#6AB0E3] dark:text-blue-400" /> : <Menu className="w-5 h-5 text-[#6AB0E3] dark:text-blue-400" />}
      </button>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#2D3748]/20 dark:bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
