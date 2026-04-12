import fs from 'fs'
import path from 'path'
import type { QuizData } from '@/types/quiz'

const QUIZZES_DIR = path.join(process.cwd(), '..', 'content', 'quizzes')

export function getQuizSlugs(): string[] {
  if (!fs.existsSync(QUIZZES_DIR)) return []
  return fs.readdirSync(QUIZZES_DIR)
    .filter(f => f.endsWith('.json') && !f.startsWith('test'))
    .map(f => {
      const raw = fs.readFileSync(path.join(QUIZZES_DIR, f), 'utf-8')
      const data = JSON.parse(raw) as QuizData
      return data.slug
    })
}

export function getQuizBySlug(slug: string): QuizData | null {
  if (!fs.existsSync(QUIZZES_DIR)) return null
  const files = fs.readdirSync(QUIZZES_DIR).filter(f => f.endsWith('.json'))
  for (const file of files) {
    const raw = fs.readFileSync(path.join(QUIZZES_DIR, file), 'utf-8')
    const data = JSON.parse(raw) as QuizData
    if (data.slug === slug) return data
  }
  return null
}

export function getAllQuizzesMeta(): Pick<QuizData, 'id' | 'slug' | 'title' | 'hook' | 'category' | 'estimatedTimeSeconds'>[] {
  if (!fs.existsSync(QUIZZES_DIR)) return []
  return fs.readdirSync(QUIZZES_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const raw = fs.readFileSync(path.join(QUIZZES_DIR, f), 'utf-8')
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
