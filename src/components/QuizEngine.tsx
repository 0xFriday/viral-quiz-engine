'use client'
import { useState } from 'react'
import type { QuizData, QuizResult } from '@/types/quiz'

function computeResult(quiz: QuizData, answers: Record<string, string>): QuizResult {
  const scores: Record<string, number> = {}
  quiz.results.forEach(r => { scores[r.id] = 0 })
  
  quiz.questions.forEach(q => {
    const selectedOptionId = answers[q.id]
    const option = q.options.find(o => o.id === selectedOptionId)
    if (option) {
      Object.entries(option.weights).forEach(([resultId, weight]) => {
        if (scores[resultId] !== undefined) {
          scores[resultId] += weight
        }
      })
    }
  })
  
  const maxScore = Math.max(...Object.values(scores))
  const winnerId = Object.entries(scores).find(([, v]) => v === maxScore)?.[0]
  return quiz.results.find(r => r.id === winnerId) || quiz.results[0]
}

export default function QuizEngine({ quiz }: { quiz: QuizData }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<QuizResult | null>(null)

  const question = quiz.questions[currentQ]
  const progress = Math.round((currentQ / quiz.questions.length) * 100)

  function handleSelect(optionId: string) {
    const newAnswers = { ...answers, [question.id]: optionId }
    setAnswers(newAnswers)
    
    if (currentQ < quiz.questions.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      setResult(computeResult(quiz, newAnswers))
    }
  }

  function handleShare() {
    if (result) {
      const text = result.shareText + '\n' + window.location.href
      if (navigator.share) {
        navigator.share({ text })
      } else {
        navigator.clipboard.writeText(text)
        alert('已複製到剪貼簿！')
      }
    }
  }

  if (result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* AdSense 佔位 */}
        <div className="adsense-slot mb-6 bg-gray-100 text-center py-4 text-gray-400 text-sm rounded" data-slot="result-top">
          [廣告位]
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{result.title}</h2>
            <p className="text-lg text-purple-600 font-medium">{result.punchline}</p>
          </div>

          <p className="text-gray-700 mb-6">{result.shortDescription}</p>

          <div className="space-y-3 mb-6">
            {result.traits.map(trait => (
              <div key={trait.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{trait.label}</span>
                  <span className="font-medium">{trait.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${trait.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-gray-600 text-sm mb-6">{result.longDescription}</p>

          <button
            onClick={handleShare}
            className="w-full bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors"
          >
            📤 分享我的結果
          </button>

          <button
            onClick={() => { setCurrentQ(0); setAnswers({}); setResult(null) }}
            className="w-full mt-3 border border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            🔄 重新測驗
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* AdSense 佔位 */}
      {currentQ === 0 && (
        <div className="adsense-slot mb-6 bg-gray-100 text-center py-4 text-gray-400 text-sm rounded" data-slot="quiz-top">
          [廣告位]
        </div>
      )}

      {/* 進度條 */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>問題 {currentQ + 1} / {quiz.questions.length}</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-purple-500 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 題目 */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-6">{question.prompt}</h3>
        {question.context && (
          <p className="text-gray-500 text-sm mb-4">{question.context}</p>
        )}

        <div className="space-y-3">
          {question.options.map(option => (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all font-medium text-gray-800"
            >
              {option.label}
              {option.subLabel && (
                <span className="block text-sm text-gray-500 mt-1">{option.subLabel}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
