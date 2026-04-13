import { getQuizSlugs, getQuizBySlug } from '@/lib/quiz-loader'
import QuizEngine from '@/components/QuizEngine'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
export function generateStaticParams() { return getQuizSlugs().map(slug => ({ slug })) }
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const quiz = getQuizBySlug(params.slug)
  if (!quiz) return {}
  return { title: quiz.seo.title, description: quiz.seo.description, openGraph: { title: quiz.seo.title, description: quiz.seo.description, type: 'website' } }
}
export default function QuizPage({ params }: { params: { slug: string } }) {
  const quiz = getQuizBySlug(params.slug)
  if (!quiz) notFound()
  return (
    <div>
      <div style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}} className="py-8 px-4">
        <div className="max-w-2xl mx-auto text-center text-white">
          <p className="text-purple-200 text-sm mb-2 uppercase tracking-widest font-medium">人格測驗</p>
          <h1 className="text-2xl font-black leading-tight">{quiz.title}</h1>
          <p className="mt-2 text-purple-100 text-sm">{quiz.hook}</p>
        </div>
      </div>
      <QuizEngine quiz={quiz} />
    </div>
  )
}
