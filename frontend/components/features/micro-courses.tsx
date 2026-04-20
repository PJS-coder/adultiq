'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Play, CheckCircle, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const COURSES = [
  {
    id: 'taxes-20-min',
    title: 'File Taxes in 20 Minutes',
    duration: '20 min',
    difficulty: 'Beginner',
    completed: false,
    action: 'Learn the basics of tax filing with practical tips',
    videoUrl: 'https://youtu.be/7jknxuR0kiw?si=FbyiHK9UuIWZbPec',
    xpReward: 50,
    category: 'tax filing'
  },
  {
    id: 'negotiate-salary',
    title: 'Negotiate Your Salary',
    duration: '15 min',
    difficulty: 'Advanced',
    completed: false,
    action: 'Master salary negotiation techniques and strategies',
    videoUrl: 'https://youtu.be/J30wmYgzVXM?si=9cnZ8HFXX7Xoni42',
    xpReward: 75,
    category: 'salary negotiation'
  },
  {
    id: 'emergency-fund',
    title: 'Create an Emergency Fund',
    duration: '12 min',
    difficulty: 'Beginner',
    completed: false,
    action: 'Learn how to build and maintain an emergency fund',
    videoUrl: 'https://youtu.be/vO2KGm8NM8E?si=ldcc69JRUZU1Oe1H',
    xpReward: 40,
    category: 'emergency fund'
  },
  {
    id: 'medical-bill',
    title: 'Read a Medical Bill',
    duration: '10 min',
    difficulty: 'Intermediate',
    completed: false,
    action: 'Understand medical billing and identify errors',
    videoUrl: 'https://youtu.be/8rfYW7cOq_c?si=HmDhjrCvVY79wmZR',
    xpReward: 45,
    category: 'read a medical bill'
  },
  {
    id: 'lease-agreements',
    title: 'Understanding Lease Agreements',
    duration: '8 min',
    difficulty: 'Intermediate',
    completed: false,
    action: 'Navigate lease agreements and know your rights',
    videoUrl: 'https://youtu.be/KnVW_wx8zKo?si=MonPedrzkz0XyaP-',
    xpReward: 35,
    category: 'lease agreements'
  },
  {
    id: 'employment-contract',
    title: 'Two Things to Know Before Signing Your Employment Contract',
    duration: '6 min',
    difficulty: 'Beginner',
    completed: false,
    action: 'Essential knowledge for employment contracts',
    videoUrl: 'https://youtu.be/-JZIY2YC4UQ?si=nWWlD7Ky1fUZ0lU4',
    xpReward: 30,
    category: 'employment contract'
  },
  {
    id: 'insurance-basics',
    title: 'What is Insurance',
    duration: '7 min',
    difficulty: 'Beginner',
    completed: false,
    action: 'Learn the fundamentals of insurance coverage',
    videoUrl: 'https://youtu.be/ifTxb9eY5jc?si=1PYusXUyTl1jz9ix',
    xpReward: 35,
    category: 'insurance'
  }
]

export default function MicroCourses() {
  const router = useRouter()
  const [completedCourses, setCompletedCourses] = useState<string[]>([])
  const [userXp, setUserXp] = useState(0)
  const [userLevel, setUserLevel] = useState(1)

  useEffect(() => {
    // Fetch user progress on component mount
    fetchUserProgress()
    
    // Also get current user data from localStorage for immediate display
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      const userData = JSON.parse(currentUser)
      setUserXp(userData.xp || 0)
      setUserLevel(userData.level || 1)
    }

    // Listen for storage changes to update progress when user completes courses
    const handleStorageChange = () => {
      const currentUser = localStorage.getItem('currentUser')
      if (currentUser) {
        const userData = JSON.parse(currentUser)
        setUserXp(userData.xp || 0)
        setUserLevel(userData.level || 1)
      }
      fetchUserProgress() // Refresh completed courses list
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Also listen for focus events to refresh when user returns to tab
    const handleFocus = () => {
      fetchUserProgress()
      const currentUser = localStorage.getItem('currentUser')
      if (currentUser) {
        const userData = JSON.parse(currentUser)
        setUserXp(userData.xp || 0)
        setUserLevel(userData.level || 1)
      }
    }

    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  const fetchUserProgress = async () => {
    try {
      // Get the token from localStorage where it's stored as currentUser
      const currentUser = localStorage.getItem('currentUser')
      const token = currentUser ? JSON.parse(currentUser).token : null
      
      if (!token) {
        console.log('No authentication token found')
        setCompletedCourses([])
        setUserXp(0)
        setUserLevel(1)
        return
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/courses/progress`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setCompletedCourses(data.completedCourses || [])
          setUserXp(data.totalXp || 0)
          setUserLevel(data.level || 1)
        }
      } else {
        console.error('Failed to fetch user progress:', response.status)
        // Set default values if API fails
        setCompletedCourses([])
        setUserXp(0)
        setUserLevel(1)
      }
    } catch (error) {
      console.error('Error fetching user progress:', error)
      // For demo purposes, set some default values
      setCompletedCourses([])
      setUserXp(0)
      setUserLevel(1)
    }
  }

  // Update courses with completion status
  const coursesWithStatus = COURSES.map(course => ({
    ...course,
    completed: completedCourses.includes(course.id)
  }))

  const completedCount = coursesWithStatus.filter((c) => c.completed).length

  const handleStartCourse = (courseId: string) => {
    router.push(`/courses/${courseId}`)
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EAF6FF]/50 dark:bg-blue-500/20 border border-[#C1E5FF] dark:border-blue-500/40 mb-4">
          <Clock className="w-4 h-4 text-[#6AB0E3] dark:text-blue-400" />
          <span className="text-sm text-[#2D3748] dark:text-white">Quick Skills</span>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-[#2D3748] dark:text-white">5-Minute Micro Courses</h1>
        <p className="text-[#6AB0E3] dark:text-blue-400">
          Learn essential life skills in bite-sized lessons. {completedCount}/{COURSES.length} completed.
        </p>
        {userXp > 0 && (
          <div className="mt-2 flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-[#9CD5FF] dark:text-blue-300">
              <Star className="w-4 h-4" />
              {userXp} XP
            </span>
            <span className="text-[#6AB0E3] dark:text-blue-400">Level {userLevel}</span>
          </div>
        )}
      </div>

      {/* Progress */}
      <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-[#C1E5FF] dark:border-gray-600 p-6 mb-8 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-[#2D3748] dark:text-white">Overall Progress</span>
          <span className="text-sm text-[#6AB0E3] dark:text-blue-400">
            {Math.round((completedCount / COURSES.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-[#EAF6FF] dark:bg-gray-700 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-[#6AB0E3] to-[#9CD5FF] h-3 rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / COURSES.length) * 100}%` }}
          />
        </div>
      </Card>

      {/* Courses Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coursesWithStatus.map((course, index) => (
          <Card
            key={index}
            className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-[#C1E5FF] dark:border-gray-600 hover:border-[#9CD5FF] dark:hover:border-blue-400 hover:shadow-lg hover:shadow-[#6AB0E3]/10 transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col ${
              course.completed ? 'bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-800' : ''
            }`}
            style={{ minHeight: '320px' }}
          >
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold mb-2 text-[#2D3748] dark:text-white min-h-[3rem] flex items-start leading-tight">{course.title}</h3>
                  <div className="flex gap-2 mb-3 flex-wrap">
                    <span className="text-xs px-2 py-1 rounded bg-[#EAF6FF] dark:bg-gray-700 text-[#6AB0E3] dark:text-blue-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {course.duration}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-gradient-to-r from-[#6AB0E3] to-[#9CD5FF] text-white">
                      {course.difficulty}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {course.xpReward} XP
                    </span>
                  </div>
                </div>
                {course.completed && (
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 ml-2" />
                )}
              </div>

              <p className="text-sm text-[#6AB0E3] dark:text-blue-400 mb-4 flex-1 min-h-[3rem]">
                <span className="font-medium">Action:</span> {course.action}
              </p>

              <Button
                className={`w-full mt-auto ${
                  course.completed 
                    ? 'bg-white dark:bg-gray-700 border border-[#C1E5FF] dark:border-gray-600 text-[#6AB0E3] dark:text-blue-400 hover:bg-[#EAF6FF] dark:hover:bg-gray-600' 
                    : 'bg-gradient-to-r from-[#6AB0E3] to-[#9CD5FF] hover:from-[#2D3748] hover:to-[#1A202C] text-white shadow-md hover:shadow-lg'
                }`}
                variant={course.completed ? 'outline' : 'default'}
                onClick={() => handleStartCourse(course.id)}
              >
                {course.completed ? (
                  'Review'
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Course
                  </>
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
