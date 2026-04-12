import fs from 'fs'
import path from 'path'
import type { QuizData } from '@/types/quiz'

// 支援兩種目錄結構：
// 1. 本機開發：webapp/ 在 project 根目錄下，content 在 ../content/quizzes
// 2. GitHub repo：webapp 就是根目錄，content 在 ./content/quizzes
function getQuizzesDir(): string {
  const candidates = [
    path.join(process.cwd(), 'content', 'quizzes'),        // repo 根目錄模式
    path.join(process.cwd(), '..', 'content', 'quizzes'),  // 本機 webapp/ 子目錄模式
  ]
  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir
  }
  return candidates[0]
}

export function getQuizSlugs(): string[] {
  const dir = getQuizzesDir()
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json') && !f.startsWith('test'))
    .map(f => {
      const raw = fs.readFileSync(path.join(dir, f), 'utf-8')
      const data = JSON.parse(raw) as QuizData
      return data.slug
    })
}

export function getQuizBySlug(slug: string): QuizData | null {
  const dir = getQuizzesDir()
  if (!fs.existsSync(dir)) return null
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'))
  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), 'utf-8')
    const data = JSON.parse(raw) as QuizData
    if (data.slug === slug) return data
  }
  return null
}

export function getAllQuizzesMeta(): Pick<QuizData, 'id' | 'slug' | 'title' | 'hook' | 'category' | 'estimatedTimeSeconds'>[] {
  const dir = getQuizzesDir()
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const raw = fs.readFileSync(path.join(dir, f), 'utf-8')
      const data = JSON.parse(raw) as QuizData
      return {
        id: data.id,
        slug: data.slug,
        title: data.title,
        hook: data.hook,
        category: data.category,
        estimatedTimeSeconds: data.estimatedTimeSeconds,
      }
    })
}
