'use client'
import Link from 'next/link'
import { useState } from 'react'
import type { QuizData, QuizResult } from '@/types/quiz'

function computeResult(quiz: QuizData, answers: Record<string, string>): QuizResult {
  const scores: Record<string, number> = {}
  quiz.results.forEach(r => { scores[r.id] = 0 })
  quiz.questions.forEach(q => {
    const option = q.options.find(o => o.id === answers[q.id])
    if (option) Object.entries(option.weights).forEach(([rid, w]) => { if (scores[rid] !== undefined) scores[rid] += w })
  })
  const maxScore = Math.max(...Object.values(scores))
  const winnerId = Object.entries(scores).find(([, v]) => v === maxScore)?.[0]
  return quiz.results.find(r => r.id === winnerId) || quiz.results[0]
}

const OPTION_HOVER = [
  'hover:bg-purple-50 hover:border-purple-400',
  'hover:bg-pink-50 hover:border-pink-400',
  'hover:bg-blue-50 hover:border-blue-400',
  'hover:bg-green-50 hover:border-green-400',
]
const OPTION_SELECTED = [
  'bg-purple-100 border-purple-500 text-purple-900',
  'bg-pink-100 border-pink-500 text-pink-900',
  'bg-blue-100 border-blue-500 text-blue-900',
  'bg-green-100 border-green-500 text-green-900',
]
const LABELS = ['A', 'B', 'C', 'D']

export default function QuizEngine({ quiz }: { quiz: QuizData }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selected, setSelected] = useState<string | null>(null)
  const [result, setResult] = useState<QuizResult | null>(null)

  const question = quiz.questions[currentQ]
  const progress = (currentQ / quiz.questions.length) * 100

  function handleSelect(optionId: string) {
    if (selected) return
    setSelected(optionId)
    const newAnswers = { ...answers, [question.id]: optionId }
    setAnswers(newAnswers)
    setTimeout(() => {
      setSelected(null)
      if (currentQ < quiz.questions.length - 1) setCurrentQ(currentQ + 1)
      else setResult(computeResult(quiz, newAnswers))
    }, 500)
  }

  function handleShare() {
    if (!result) return
    const text = `${result.shareText}\n\n→ ${window.location.href}`
    if (navigator.share) navigator.share({ text, url: window.location.href })
    else navigator.clipboard.writeText(text).then(() => alert('已複製！貼到社群分享吧 📤'))
  }

  if (result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="adsense-slot mb-6 bg-gray-100 rounded-xl py-3 text-center text-xs text-gray-400 border-2 border-dashed border-gray-200" data-slot="result-top">廣告</div>
        <div className="rounded-3xl overflow-hidden shadow-xl mb-6" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
          <div className="p-8 text-white text-center">
            {quiz.id && result.id && (
              <img
                src={`/viral-quiz-engine/images/results/${quiz.id}/${result.id}.png`}
                alt={result.title}
                className="w-48 h-48 object-cover rounded-2xl mx-auto mb-4 shadow-lg"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            )}
            <p className="text-pink-100 text-xs uppercase tracking-widest mb-2">你的結果是</p>
            <h2 className="text-3xl font-black mb-3">{result.title}</h2>
            <p className="text-xl font-medium text-pink-100">{result.punchline}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
          <p className="text-gray-700 leading-relaxed">{result.shortDescription}</p>
        </div>
        {result.traits && result.traits.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
            <h3 className="font-bold text-gray-800 mb-4">你的成分分析</h3>
            <div className="space-y-4">
              {result.traits.map(trait => (
                <div key={trait.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-700 font-medium">{trait.label}</span>
                    <span className="text-purple-600 font-bold">{trait.value}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className="h-3 rounded-full" style={{ width: `${trait.value}%`, background: 'linear-gradient(90deg, #667eea, #764ba2)' }} />
                  </div>
                  {trait.comment && <p className="text-xs text-gray-400 mt-1">{trait.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="bg-purple-50 rounded-2xl p-6 mb-6 border border-purple-100">
          <p className="text-gray-600 text-sm leading-relaxed">{result.longDescription}</p>
        </div>
        <button onClick={handleShare} className="w-full text-white font-bold py-4 rounded-2xl text-lg mb-3 shadow-lg active:scale-95 transition-transform" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
          📤 分享我的結果
        </button>
        <button onClick={() => { setCurrentQ(0); setAnswers({}); setResult(null) }} className="w-full bg-white border-2 border-gray-200 text-gray-600 font-bold py-4 rounded-2xl text-lg active:scale-95 transition-transform mb-4">
          🔄 重新測驗
        </button>
        {/* Affiliate 推薦 */}
        {quiz.affiliate && quiz.affiliate.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 mb-4 border border-amber-100">
            <p className="text-xs text-amber-600 font-bold uppercase tracking-widest mb-3">✨ 你可能會喜歡</p>
            <div className="space-y-3">
              {quiz.affiliate.map((item: {title: string; desc: string; url: string; tag?: string}) => (
                <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer sponsored"
                  className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all">
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 text-sm">{item.title}</p>
                    <p className="text-gray-500 text-xs">{item.desc}</p>
                  </div>
                  {item.tag && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium flex-shrink-0">{item.tag}</span>}
                  <span className="text-gray-400">›</span>
                </a>
              ))}
            </div>
          </div>
        )}
        <Link href="/" className="block text-center text-purple-600 text-sm font-medium py-2">← 試試其他測驗</Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {currentQ === 0 && (
        <div className="adsense-slot mb-6 bg-gray-100 rounded-xl py-3 text-center text-xs text-gray-400 border-2 border-dashed border-gray-200" data-slot="quiz-top">廣告</div>
      )}
      <div className="mb-6">
        <div className="flex justify-between items-center text-sm mb-2">
          <span className="text-gray-400">問題 {currentQ + 1} / {quiz.questions.length}</span>
          <span className="text-purple-600 font-bold">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #667eea, #764ba2)' }} />
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-5">
        <p className="text-xs text-purple-400 font-bold uppercase tracking-widest mb-3">Q{currentQ + 1}</p>
        <h3 className="text-xl font-black text-gray-900 leading-snug">{question.prompt}</h3>
        {question.context && <p className="text-sm text-gray-400 mt-2">{question.context}</p>}
      </div>
      <div className="space-y-3">
        {question.options.map((option, idx) => {
          const isSelected = selected === option.id
          return (
            <button key={option.id} onClick={() => handleSelect(option.id)} disabled={!!selected}
              className={`w-full text-left p-4 rounded-2xl border-2 font-medium transition-all duration-150 flex items-center gap-4
                ${isSelected ? OPTION_SELECTED[idx % 4] : `bg-white border-gray-200 text-gray-800 ${OPTION_HOVER[idx % 4]}`}
                ${selected && !isSelected ? 'opacity-40' : ''}
              `}
            >
              <span className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${isSelected ? 'bg-white/60' : 'bg-gray-100'}`}>
                {LABELS[idx]}
              </span>
              <span className="flex-1 leading-snug">{option.label}</span>
              {isSelected && <span className="text-lg flex-shrink-0">✓</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
