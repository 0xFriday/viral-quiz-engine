import Link from 'next/link'
import { getAllQuizzesMeta } from '@/lib/quiz-loader'

const CATEGORY_CONFIG: Record<string, { label: string; emoji: string; color: string }> = {
  'ingredient-analysis': { label: '成分分析', emoji: '🧬', color: 'bg-green-100 text-green-700' },
  'absurd-objectification': { label: '荒謬物件化', emoji: '🪨', color: 'bg-orange-100 text-orange-700' },
  'personality-projection': { label: '人格投射', emoji: '🎭', color: 'bg-blue-100 text-blue-700' },
}
const QUIZ_EMOJIS = ['🪨', '💀', '🤖', '🌊', '🎯', '⚡']

export default function HomePage() {
  const quizzes = getAllQuizzesMeta()
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🧪</div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">你是哪種人？</h1>
        <p className="text-gray-500">爆笑測驗 × 成分分析 × 結果想截圖分享</p>
        <div className="flex justify-center gap-4 mt-4 text-sm text-gray-400">
          <span>✅ 免費</span><span>⏱ 2分鐘</span><span>📤 可分享</span>
        </div>
      </div>
      {quizzes.length === 0 ? (
        <div className="text-center text-gray-400 py-20">測驗準備中...</div>
      ) : (
        <div className="space-y-4">
          {quizzes.map((q, i) => {
            const cat = CATEGORY_CONFIG[q.category] || { label: q.category, emoji: '🎯', color: 'bg-gray-100 text-gray-600' }
            return (
              <Link key={q.id} href={`/quiz/${q.slug}/`} className="block bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-5 border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="text-4xl flex-shrink-0">{QUIZ_EMOJIS[i % QUIZ_EMOJIS.length]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cat.color}`}>{cat.emoji} {cat.label}</span>
                      {q.estimatedTimeSeconds && <span className="text-xs text-gray-400">⏱ {Math.ceil(q.estimatedTimeSeconds / 60)}分鐘</span>}
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 leading-tight">{q.title}</h2>
                    <p className="text-gray-500 text-sm mt-1">{q.hook}</p>
                  </div>
                  <div className="text-gray-300 text-2xl">›</div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
      <p className="text-center text-gray-300 text-xs mt-10">更多測驗持續更新中 ✨</p>
    </div>
  )
}
