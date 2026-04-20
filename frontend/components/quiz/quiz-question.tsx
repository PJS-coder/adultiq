'use client'

interface QuizQuestionProps {
  question: {
    id: number
    question: string
    options: string[]
    correctAnswer?: string
  }
  selected: string | string[] | undefined
  onSelect: (answer: string | string[]) => void
}

export default function QuizQuestion({
  question,
  selected,
  onSelect,
}: QuizQuestionProps) {
  const handleSelect = (option: string) => {
    onSelect(option)
  }

  return (
    <div>
      <div className="text-center mb-4">
        <h3 className="text-base font-bold mb-2 text-[#2D3748] dark:text-white leading-tight">
          {question.question}
        </h3>
        <div className="w-8 h-0.5 bg-gradient-to-r from-[#6AB0E3] to-[#9CD5FF] rounded-full mx-auto"></div>
      </div>

      <div className="space-y-2">
        {question.options.map((option, index) => {
          const isSelected = selected === option
          const optionLetter = String.fromCharCode(65 + index) // A, B, C, D

          return (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={`w-full p-2.5 rounded-lg border-2 transition-all duration-200 text-left group hover:scale-[1.01] ${
                isSelected
                  ? 'border-[#6AB0E3] bg-gradient-to-r from-[#EAF6FF] to-white dark:from-blue-900/30 dark:to-gray-800 shadow-md'
                  : 'border-[#C1E5FF] dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 hover:border-[#9CD5FF] dark:hover:border-gray-500 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all flex-shrink-0 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#6AB0E3] to-[#9CD5FF] border-[#6AB0E3] text-white shadow-sm'
                      : 'border-[#C1E5FF] dark:border-gray-500 bg-white dark:bg-gray-700 text-[#6AB0E3] dark:text-blue-400 group-hover:border-[#9CD5FF]'
                  }`}
                >
                  {optionLetter}
                </div>
                <span className={`text-xs font-medium leading-relaxed pt-0.5 ${
                  isSelected 
                    ? 'text-[#2D3748] dark:text-white' 
                    : 'text-[#2D3748] dark:text-gray-200 group-hover:text-[#1A202C] dark:group-hover:text-white'
                }`}>
                  {option}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
