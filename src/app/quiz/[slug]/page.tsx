import { getQuizSlugs, getQuizBySlug } from '@/lib/quiz-loader'
import QuizEngine from '@/components/QuizEngine'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export function generateStaticParams() {
  const slugs = getQuizSlugs()
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const quiz = getQuizBySlug(params.slug)
  if (!quiz) return {}
  return {
    title: quiz.seo.title,
    description: quiz.seo.description,
  }
}

export default function QuizPage({ params }: { params: { slug: string } }) {
  const quiz = getQuizBySlug(params.slug)
  if (!quiz) notFound()

  return (
    <div>
      <div className="max-w-2xl mx-auto px-4 pt-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
        <p className="text-gray-600 mb-6">{quiz.hook}</p>
      </div>
      <QuizEngine quiz={quiz} />
    </div>
  )
}
