export interface QuizOption {
  id: string
  label: string
  subLabel?: string
  weights: Record<string, number>
}

export interface QuizQuestion {
  id: string
  prompt: string
  context?: string
  options: QuizOption[]
}

export interface QuizTrait {
  label: string
  value: number
  comment?: string
}

export interface QuizResult {
  id: string
  title: string
  punchline: string
  shortDescription: string
  longDescription: string
  traits: QuizTrait[]
  shareText: string
  shareHashtags?: string[]
  tags?: string[]
}

export interface QuizSeo {
  title: string
  description: string
  keywords?: string[]
}

export interface QuizShare {
  defaultText: string
  imageTemplate: string
  ctaLabel: string
  ctaUrl?: string
}

export interface QuizData {
  id: string
  slug: string
  status: string
  category: string
  title: string
  hook: string
  subtitle?: string
  description?: string
  tone?: string[]
  estimatedTimeSeconds?: number
  questions: QuizQuestion[]
  results: QuizResult[]
  resultLogic: {
    mode: string
    tieBreaker: string
  }
  seo: QuizSeo
  share: QuizShare
}
