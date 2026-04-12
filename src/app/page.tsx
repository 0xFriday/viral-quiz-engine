import { getAllQuizzesMeta } from '@/lib/quiz-loader'

const CATEGORY_LABELS: Record<string, string> = {
  'ingredient-analysis': '成分分析',
  'absurd-objectification': '荒謬物件化',
  'personality-projection': '人格投射',
}

export default function HomePage() {
  const quizzes = getAllQuizzesMeta()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">你是哪種人？</h1>
        <p className="text-gray-600">爆笑測驗 × 成分分析 × 結果想截圖分享</p>
      </div>

      {quizzes.length === 0 ? (
        <div className="text-center text-gray-400 py-20">
          <p>測驗準備中...</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {quizzes.map(q => (
            <a
              key={q.id}
              href={`/quiz/${q.slug}/`}
              className="bg-white rounded-2xl shadow p-5 hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  {CATEGORY_LABELS[q.category] || q.category}
                </span>
                {q.estimatedTimeSeconds && (
                  <span className="text-xs text-gray-400">
                    約 {Math.ceil(q.estimatedTimeSeconds / 60)} 分鐘
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">{q.title}</h2>
              <p className="text-gray-600 text-sm">{q.hook}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
