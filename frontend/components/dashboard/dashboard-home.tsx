'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  MessageSquare,
  Zap,
  BookOpen,
  TrendingUp,
  Trophy,
  Target,
  Sparkles,
  Clock,
} from 'lucide-react'
import { api } from '@/lib/api'

interface DashboardHomeProps {
  user: {
    id: string
    name: string
    email: string
    adultIqScore: number
    level?: number
    xp?: number
  }
}

interface UserStats {
  level: number
  xp: number
  adultIqScore: number
  achievementsEarned: number
  milestonesCompleted: number
  coursesCompleted: number
}

interface Achievement {
  _id: string
  badgeName: string
  badgeType: string
  description: string
  earnedAt: string
}

const QUICK_ACTIONS = [
  {
    title: 'AI Life Coach',
    description: 'Get instant advice',
    href: '/coach',
    icon: MessageSquare,
    color: 'teal',
    emoji: '🤖'
  },
  {
    title: 'Simulations',
    description: 'Practice scenarios',
    href: '/simulations',
    icon: Zap,
    color: 'emerald',
    emoji: '⚡'
  },
  {
    title: 'Documents',
    description: 'Decode paperwork',
    href: '/documents',
    icon: BookOpen,
    color: 'blue',
    emoji: '📋'
  },
  {
    title: 'Finance',
    description: 'Track your money',
    href: '/finance',
    icon: TrendingUp,
    color: 'amber',
    emoji: '💰'
  },
]

export default function DashboardHome({ user }: DashboardHomeProps) {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsResponse, achievementsResponse] = await Promise.all([
          api.getUserStats(),
          api.getAchievements(),
        ])

        if (statsResponse.success) {
          setStats(statsResponse.stats)
        }

        if (achievementsResponse.success) {
          setAchievements(achievementsResponse.achievements)
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const level = stats?.level || user.level || 1
  const xp = stats?.xp || user.xp || 0
  const adultIqScore = stats?.adultIqScore || user.adultIqScore || 0
  const achievementsCount = stats?.achievementsEarned || achievements.length
  
  // Calculate progress to next level (500 XP per level)
  const xpForNextLevel = level * 500
  const currentLevelXp = xp % 500
  const progress = (currentLevelXp / 500) * 100

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Compact Hero Section with Blue Theme */}
      <div className="relative bg-gradient-to-br from-[#FFFFFF] via-[#EAF6FF] to-[#C1E5FF] dark:from-[#2D3748] dark:via-[#4A5568] dark:to-[#1A202C] rounded-lg border border-[#C1E5FF] dark:border-gray-600 p-6 overflow-hidden shadow-lg">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 right-2 w-16 h-16 bg-[#9CD5FF] rounded-full blur-2xl"></div>
          <div className="absolute bottom-2 left-2 w-12 h-12 bg-[#6AB0E3] rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-[#2D3748] rounded-full blur-lg"></div>
        </div>
        
          <div className="relative z-10 flex items-center justify-between">
          {/* Left Side - Greeting and Stats */}
          <div className="flex-1">
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-[#2D3748] dark:text-white mb-1 animate-fade-in">
                Hey {user.name.split(' ')[0]}! 
                <span className="inline-block animate-wave ml-1">👋</span>
              </h1>
              <p className="text-sm text-[#6AB0E3] dark:text-blue-400 animate-fade-in-delay">Ready to level up your adult skills today?</p>
            </div>
            
            {/* Stats Row in 3D Shadow Boxes */}
            <div className="flex gap-4">
              <div className="w-40 bg-white rounded-lg p-2 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slide-up border border-[#EAF6FF]">
                <div className="text-2xl font-bold text-[#2D3748]">{adultIqScore}</div>
                <div className="text-xs text-[#6AB0E3]">AdultIQ Score</div>
              </div>
              <div className="w-40 bg-white rounded-lg p-2 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slide-up-delay-1 border border-[#EAF6FF]">
                <div className="text-2xl font-bold text-[#2D3748]">{xp}</div>
                <div className="text-xs text-[#6AB0E3]">Total XP</div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Circular Progress with Level */}
          <div className="relative animate-slide-up-delay-2">
            {/* Progress Circle */}
            <div className="relative w-32 h-32">
              {/* Background Circle */}
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  className="text-[#EAF6FF]"
                />
                {/* Progress Circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
                  className="text-[#6AB0E3] transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              
              {/* Center Circle with Level and Percentage */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#6AB0E3] via-[#9CD5FF] to-[#C1E5FF] dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-500">
                  {/* Inner highlight */}
                  <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                  
                  {/* Level and Percentage text */}
                  <div className="relative text-center z-10">
                    <div className="text-xs font-semibold text-white tracking-wide">LV</div>
                    <div className="text-xl font-bold text-white -mt-0.5">{level}</div>
                    <div className="text-xs font-medium text-white/80 -mt-1">{Math.round(progress)}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Quick Actions */}
      <div className="animate-fade-in-up">
        <h2 className="text-lg font-bold text-[#6AB0E3] dark:text-blue-400 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#9CD5FF] dark:text-blue-300" />
          Jump into action
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((action, index) => {
            return (
              <Link key={action.href} href={action.href}>
                <div 
                  className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 border border-[#EAF6FF] dark:border-gray-600 hover:border-[#C1E5FF] dark:hover:border-gray-500 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 animate-card-appear"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Single Emoji Icon */}
                  <div className="w-12 h-12 bg-gradient-to-br from-[#EAF6FF] to-[#C1E5FF] dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-all duration-300 shadow-sm">
                    <span className="text-2xl">{action.emoji}</span>
                  </div>
                  
                  <h3 className="font-semibold text-[#6AB0E3] dark:text-blue-400 text-sm mb-1">{action.title}</h3>
                  <p className="text-xs text-[#9CD5FF] dark:text-gray-400">{action.description}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Compact Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Compact Recent Achievements */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg border border-[#C1E5FF] dark:border-gray-600 p-4 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#2D3748] dark:text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#9CD5FF] dark:text-blue-400" />
              Achievements
            </h3>
            <Link href="/achievements" className="text-xs text-[#6AB0E3] dark:text-blue-400 hover:text-[#2D3748] dark:hover:text-white font-medium hover:underline transition-colors">
              View all
            </Link>
          </div>
          
          {achievements.length > 0 ? (
            <div className="space-y-3">
              {achievements.slice(0, 2).map((achievement, index) => (
                <div 
                  key={achievement._id} 
                  className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#EAF6FF] to-white dark:from-gray-700 dark:to-gray-800 rounded-lg border border-[#C1E5FF] dark:border-gray-600 hover:shadow-sm transition-all duration-300 animate-achievement-slide"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-[#9CD5FF] to-[#6AB0E3] rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[#2D3748] dark:text-white text-sm truncate">{achievement.badgeName}</h4>
                    <p className="text-xs text-[#9CD5FF] dark:text-gray-400">
                      {new Date(achievement.earnedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 animate-fade-in">
              <div className="w-12 h-12 bg-gradient-to-br from-[#EAF6FF] to-[#C1E5FF] dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse-gentle">
                <Trophy className="w-6 h-6 text-[#6AB0E3] dark:text-blue-400" />
              </div>
              <h4 className="font-semibold text-[#2D3748] dark:text-white text-sm mb-1">No achievements yet</h4>
              <p className="text-xs text-[#9CD5FF] dark:text-gray-400">Complete activities to earn badges!</p>
            </div>
          )}
        </div>

        {/* Compact Recommended Next */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg border border-[#C1E5FF] dark:border-gray-600 p-4 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up">
          <h3 className="text-lg font-bold text-[#2D3748] dark:text-white mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-[#6AB0E3] dark:text-blue-400" />
            Recommended
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-gradient-to-br from-[#EAF6FF] to-white dark:from-gray-700 dark:to-gray-800 rounded-lg border border-[#C1E5FF] dark:border-gray-600 hover:shadow-sm transition-all duration-300 transform hover:scale-105 animate-recommendation-slide">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-[#2D3748] dark:text-white text-sm">Try a Simulation</h4>
                <span className="text-xs px-2 py-1 bg-gradient-to-r from-[#9CD5FF] to-[#C1E5FF] dark:from-blue-600 dark:to-blue-500 text-[#2D3748] dark:text-white rounded-full font-medium">
                  +150 XP
                </span>
              </div>
              <p className="text-xs text-[#6AB0E3] dark:text-blue-400 mb-2">Practice salary negotiation</p>
              <Link href="/simulations">
                <Button size="sm" className="w-full bg-gradient-to-r from-[#6AB0E3] to-[#9CD5FF] hover:from-[#2D3748] hover:to-[#1A202C] dark:hover:from-blue-600 dark:hover:to-blue-700 text-white text-xs shadow-md hover:shadow-lg transition-all">
                  Start Now
                </Button>
              </Link>
            </div>

            <div className="p-3 bg-gradient-to-br from-[#C1E5FF] to-white dark:from-gray-600 dark:to-gray-700 rounded-lg border border-[#9CD5FF] dark:border-gray-500 hover:shadow-sm transition-all duration-300 transform hover:scale-105 animate-recommendation-slide-delay">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-[#2D3748] dark:text-white text-sm">Learn a Skill</h4>
                <span className="text-xs px-2 py-1 bg-gradient-to-r from-[#6AB0E3] to-[#9CD5FF] text-white rounded-full font-medium">
                  +15 XP
                </span>
              </div>
              <p className="text-xs text-[#6AB0E3] dark:text-blue-400 mb-2">5-minute course on credit</p>
              <Link href="/courses">
                <Button size="sm" variant="outline" className="w-full border-[#6AB0E3] dark:border-blue-400 hover:bg-[#EAF6FF] dark:hover:bg-gray-700 hover:border-[#2D3748] dark:hover:border-blue-300 text-[#6AB0E3] dark:text-blue-400 hover:text-[#2D3748] dark:hover:text-white text-xs transition-all">
                  Browse Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-10deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes pulse-gentle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .animate-wave { animation: wave 2s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-fade-in-delay { animation: fade-in 0.5s ease-out 0.1s both; }
        .animate-fade-in-up { animation: fade-in 0.6s ease-out; }
        .animate-slide-up { animation: slide-up 0.5s ease-out; }
        .animate-slide-up-delay-1 { animation: slide-up 0.5s ease-out 0.1s both; }
        .animate-slide-up-delay-2 { animation: slide-up 0.5s ease-out 0.2s both; }
        .animate-progress-fill { animation: slide-up 0.8s ease-out; }
        .animate-shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer 2s infinite;
        }
        .animate-card-appear { animation: slide-up 0.5s ease-out both; }
        .animate-achievement-slide { animation: slide-up 0.4s ease-out both; }
        .animate-recommendation-slide { animation: slide-up 0.5s ease-out; }
        .animate-recommendation-slide-delay { animation: slide-up 0.5s ease-out 0.1s both; }
        .animate-pulse-gentle { animation: pulse-gentle 2s ease-in-out infinite; }
      `}</style>
    </div>
  )
}
