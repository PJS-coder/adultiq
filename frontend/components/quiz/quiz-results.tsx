'use client'

import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

interface QuizResultsProps {
  score: number
  onFinish: () => void
}

export default function QuizResults({ score, onFinish }: QuizResultsProps) {
  const getScoreMessage = (score: number) => {
    if (score >= 85) return 'Outstanding! You\'re an adulting expert!'
    if (score >= 65) return 'Great job! You have solid life skills knowledge!'
    if (score >= 45) return 'Good start! Keep learning to level up!'
    return 'No worries! AdultIQ will help you master these skills!'
  }

  const getScoreDescription = (score: number) => {
    if (score >= 85) return 'You have excellent knowledge of essential life skills. You\'re well-prepared to handle real-world challenges.'
    if (score >= 65) return 'You have a good foundation in life skills. With a bit more learning, you\'ll be fully prepared for adult responsibilities.'
    if (score >= 45) return 'You\'re on the right path! Focus on the areas where you need improvement, and you\'ll see your score rise quickly.'
    return 'Everyone starts somewhere! Use AdultIQ to learn the essential skills that will help you navigate adult life with confidence.'
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-[#6AB0E3] dark:text-blue-400'
    if (score >= 65) return 'text-[#6AB0E3] dark:text-blue-400'
    if (score >= 45) return 'text-[#9CD5FF] dark:text-blue-300'
    return 'text-[#C1E5FF] dark:text-blue-200'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFFFF] via-[#EAF6FF] to-[#C1E5FF] dark:from-[#1A202C] dark:via-[#2D3748] dark:to-[#4A5568] flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center py-8">
        {/* Compact Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-[#C1E5FF] dark:border-gray-600 shadow-lg mb-4">
            <Sparkles className="w-4 h-4 text-[#6AB0E3] dark:text-blue-400" />
            <span className="text-sm font-semibold text-[#2D3748] dark:text-white">Assessment Complete!</span>
          </div>
          
          <h1 className="text-2xl font-bold text-[#2D3748] dark:text-white mb-2">
            Your <span className="text-[#6AB0E3] dark:text-blue-400">AdultIQ Score</span>
          </h1>
        </div>

        {/* Compact Score Card */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-[#C1E5FF] dark:border-gray-600 rounded-2xl p-6 mb-6 shadow-2xl">
          {/* Smaller Score Circle */}
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-[#EAF6FF] dark:text-gray-600"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / 100)}`}
                className={`transition-all duration-2000 ease-out ${getScoreColor(score)}`}
                strokeLinecap="round"
              />
            </svg>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-4xl font-bold mb-1 ${getScoreColor(score)}`}>
                  {score}
                </div>
                <div className="text-xs text-[#9CD5FF] dark:text-gray-400 font-medium">
                  AdultIQ Score
                </div>
              </div>
            </div>
          </div>

          {/* Compact Message */}
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[#2D3748] dark:text-white mb-2">
              {getScoreMessage(score)}
            </h2>
            <p className="text-[#6AB0E3] dark:text-blue-400 text-sm max-w-xl mx-auto leading-relaxed">
              {getScoreDescription(score)}
            </p>
          </div>

          {/* Compact Breakdown */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-[#EAF6FF] to-white dark:from-gray-700 dark:to-gray-800 rounded-lg border border-[#C1E5FF] dark:border-gray-600">
              <div className="text-lg font-bold text-[#6AB0E3] dark:text-blue-400">
                {Math.round((score / 100) * 12)}/12
              </div>
              <div className="text-xs text-[#9CD5FF] dark:text-gray-400">Correct</div>
            </div>
            <div className="p-3 bg-gradient-to-br from-[#EAF6FF] to-white dark:from-gray-700 dark:to-gray-800 rounded-lg border border-[#C1E5FF] dark:border-gray-600">
              <div className="text-lg font-bold text-[#6AB0E3] dark:text-blue-400">
                {score >= 85 ? 'Expert' : score >= 65 ? 'Competent' : score >= 45 ? 'Learning' : 'Beginner'}
              </div>
              <div className="text-xs text-[#9CD5FF] dark:text-gray-400">Level</div>
            </div>
            <div className="p-3 bg-gradient-to-br from-[#EAF6FF] to-white dark:from-gray-700 dark:to-gray-800 rounded-lg border border-[#C1E5FF] dark:border-gray-600">
              <div className="text-lg font-bold text-[#6AB0E3] dark:text-blue-400">
                {score >= 85 ? '🏆' : score >= 65 ? '🎯' : score >= 45 ? '📚' : '🌱'}
              </div>
              <div className="text-xs text-[#9CD5FF] dark:text-gray-400">Badge</div>
            </div>
          </div>
        </div>

        {/* Compact Next Steps */}
        <div className="space-y-4">
          <div className="p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-[#C1E5FF] dark:border-gray-600">
            <h3 className="text-sm font-semibold text-[#2D3748] dark:text-white mb-2">What's Next?</h3>
            <p className="text-[#6AB0E3] dark:text-blue-400 text-xs mb-3">
              Ready to start your personalized learning journey? Your dashboard awaits!
            </p>
          </div>
          
          <Button
            onClick={onFinish}
            className="w-full max-w-sm mx-auto bg-gradient-to-r from-[#6AB0E3] to-[#9CD5FF] hover:from-[#2D3748] hover:to-[#1A202C] dark:hover:from-blue-600 dark:hover:to-blue-700 text-white py-3 text-sm rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            Enter Your Dashboard →
          </Button>
        </div>
      </div>
    </div>
  )
}
