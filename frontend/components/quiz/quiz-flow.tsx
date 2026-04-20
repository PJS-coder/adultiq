'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import QuizQuestion from './quiz-question'
import QuizResults from './quiz-results'
import { api } from '@/lib/api'

const QUIZ_QUESTIONS = [
  {
    id: 1,
    category: 'credit',
    question: 'What is a credit score primarily used for?',
    options: [
      'To determine your income level',
      'To assess your creditworthiness for loans and rentals',
      'To calculate your tax bracket',
      'To track your spending habits'
    ],
    correctAnswer: 'To assess your creditworthiness for loans and rentals',
  },
  {
    id: 2,
    category: 'taxes',
    question: 'What is a W-2 form?',
    options: [
      'A form to apply for unemployment benefits',
      'A document showing your annual wages and taxes withheld',
      'A lease agreement for apartments',
      'A health insurance enrollment form'
    ],
    correctAnswer: 'A document showing your annual wages and taxes withheld',
  },
  {
    id: 3,
    category: 'insurance',
    question: 'What is a deductible in health insurance?',
    options: [
      'The monthly payment you make for insurance',
      'The amount you pay before insurance starts covering costs',
      'The maximum amount insurance will pay per year',
      'A discount for healthy lifestyle choices'
    ],
    correctAnswer: 'The amount you pay before insurance starts covering costs',
  },
  {
    id: 4,
    category: 'renting',
    question: 'What is typically required when signing a lease?',
    options: [
      'Only first month\'s rent',
      'Security deposit and first month\'s rent',
      'Six months rent upfront',
      'Just a verbal agreement'
    ],
    correctAnswer: 'Security deposit and first month\'s rent',
  },
  {
    id: 5,
    category: 'finance',
    question: 'What is the recommended emergency fund size?',
    options: [
      '1 month of expenses',
      '3-6 months of expenses',
      '1 year of expenses',
      'No emergency fund needed'
    ],
    correctAnswer: '3-6 months of expenses',
  },
  {
    id: 6,
    category: 'employment',
    question: 'What does "gross income" mean on a pay stub?',
    options: [
      'Income after all deductions',
      'Income before any deductions',
      'Only overtime pay',
      'Annual salary divided by 12'
    ],
    correctAnswer: 'Income before any deductions',
  },
  {
    id: 7,
    category: 'rights',
    question: 'Can a landlord enter your apartment without notice?',
    options: [
      'Yes, anytime since they own the property',
      'No, they must provide reasonable notice except in emergencies',
      'Only during business hours',
      'Yes, but only once per month'
    ],
    correctAnswer: 'No, they must provide reasonable notice except in emergencies',
  },
  {
    id: 8,
    category: 'debt',
    question: 'What happens if you only pay the minimum on a credit card?',
    options: [
      'You avoid all interest charges',
      'You pay significantly more in interest over time',
      'Your credit score automatically improves',
      'The remaining balance is forgiven'
    ],
    correctAnswer: 'You pay significantly more in interest over time',
  },
  {
    id: 9,
    category: 'healthcare',
    question: 'When should you go to urgent care instead of the ER?',
    options: [
      'For life-threatening emergencies',
      'For non-life-threatening issues like minor injuries or flu',
      'Never, always go to the ER',
      'Only if you don\'t have insurance'
    ],
    correctAnswer: 'For non-life-threatening issues like minor injuries or flu',
  },
  {
    id: 10,
    category: 'investing',
    question: 'What is a 401(k)?',
    options: [
      'A type of savings account at a bank',
      'An employer-sponsored retirement savings plan',
      'A government loan program',
      'A credit card rewards program'
    ],
    correctAnswer: 'An employer-sponsored retirement savings plan',
  },
  {
    id: 11,
    category: 'contracts',
    question: 'What should you do before signing any contract?',
    options: [
      'Sign immediately to secure the deal',
      'Read it carefully and ask questions about unclear terms',
      'Only read the first page',
      'Trust that everything is standard'
    ],
    correctAnswer: 'Read it carefully and ask questions about unclear terms',
  },
  {
    id: 12,
    category: 'budgeting',
    question: 'What is the 50/30/20 budgeting rule?',
    options: [
      '50% savings, 30% needs, 20% wants',
      '50% needs, 30% wants, 20% savings',
      '50% wants, 30% savings, 20% needs',
      '50% rent, 30% food, 20% entertainment'
    ],
    correctAnswer: '50% needs, 30% wants, 20% savings',
  },
]

export default function QuizFlow() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const progress = ((currentStep + 1) / QUIZ_QUESTIONS.length) * 100

  const handleAnswer = (answer: string | string[]) => {
    const question = QUIZ_QUESTIONS[currentStep]
    setAnswers({
      ...answers,
      [question.category]: answer,
    })
  }

  const handleNext = () => {
    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      calculateScore()
      setShowResults(true)
    }
  }

  const calculateScore = () => {
    // Calculate AdultIQ score based on correct answers
    let correctAnswers = 0
    
    QUIZ_QUESTIONS.forEach((question) => {
      const userAnswer = answers[question.category]
      if (userAnswer === question.correctAnswer) {
        correctAnswers++
      }
    })
    
    // Convert to score out of 100
    // 0-3 correct: 20-40 (Beginner)
    // 4-6 correct: 45-60 (Learning)
    // 7-9 correct: 65-80 (Competent)
    // 10-12 correct: 85-100 (Expert)
    const baseScore = Math.round((correctAnswers / QUIZ_QUESTIONS.length) * 100)
    
    setScore(baseScore)
  }

  const handleFinish = async () => {
    try {
      const response = await api.submitQuiz(answers, score)
      
      if (response.success) {
        // Update local storage with new user data
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
        localStorage.setItem('currentUser', JSON.stringify({
          ...currentUser,
          ...response.user,
        }))
        
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Quiz submission error:', error)
      // Fallback to dashboard even if API fails
      router.push('/dashboard')
    }
  }

  if (showResults) {
    return <QuizResults score={score} onFinish={handleFinish} />
  }

  const question = QUIZ_QUESTIONS[currentStep]
  const isAnswered = answers[question.category] !== undefined

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFFFF] via-[#EAF6FF] to-[#C1E5FF] dark:from-[#1A202C] dark:via-[#2D3748] dark:to-[#4A5568] px-4 py-4">
      <div className="max-w-2xl mx-auto h-screen flex flex-col">
        {/* Ultra Compact Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-[#C1E5FF] dark:border-gray-600 shadow-lg mb-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#6AB0E3] to-[#9CD5FF] flex items-center justify-center">
              <span className="text-white font-bold text-xs">IQ</span>
            </div>
            <span className="text-xs font-semibold text-[#2D3748] dark:text-white">AdultIQ Assessment</span>
          </div>
          
          <h1 className="text-lg font-bold text-[#2D3748] dark:text-white mb-1">
            Discover your <span className="text-[#6AB0E3] dark:text-blue-400">Adult Life Skills</span>
          </h1>
          <p className="text-xs text-[#6AB0E3] dark:text-blue-400">
            Get your personalized AdultIQ score
          </p>
        </div>

        {/* Ultra Compact Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#6AB0E3] to-[#9CD5FF] flex items-center justify-center text-white font-bold text-xs">
                {currentStep + 1}
              </div>
              <div>
                <p className="text-xs text-[#9CD5FF] dark:text-blue-300">Question {currentStep + 1} of {QUIZ_QUESTIONS.length}</p>
                <p className="text-xs text-[#6AB0E3] dark:text-blue-400 capitalize">{question.category}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-[#2D3748] dark:text-white">{Math.round(progress)}%</p>
            </div>
          </div>
          
          <div className="w-full bg-[#EAF6FF] dark:bg-gray-700 rounded-full h-1.5 overflow-hidden shadow-inner">
            <div 
              className="bg-gradient-to-r from-[#6AB0E3] to-[#9CD5FF] h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Ultra Compact Question Card */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-[#C1E5FF] dark:border-gray-600 rounded-xl p-4 shadow-xl">
          <QuizQuestion
            question={question}
            selected={answers[question.category]}
            onSelect={handleAnswer}
          />

          {/* Compact Navigation */}
          <div className="flex gap-2 mt-3">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="flex-1 py-1.5 text-xs border-[#C1E5FF] dark:border-gray-600 text-[#6AB0E3] dark:text-blue-400 hover:bg-[#EAF6FF] dark:hover:bg-gray-700 disabled:opacity-50"
            >
              ← Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!isAnswered}
              className="flex-1 py-1.5 text-xs bg-gradient-to-r from-[#6AB0E3] to-[#9CD5FF] hover:from-[#2D3748] hover:to-[#1A202C] dark:hover:from-blue-600 dark:hover:to-blue-700 text-white font-medium shadow-lg disabled:opacity-50"
            >
              {currentStep === QUIZ_QUESTIONS.length - 1 ? 'Results →' : 'Next →'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
