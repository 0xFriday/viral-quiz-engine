import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '測驗站 — 找出你是哪種人',
  description: '爆笑人格測驗，成分分析，看懂自己',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body className="bg-gray-50 min-h-screen">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-purple-700">🧪 測驗站</a>
          </div>
        </header>
        <main>{children}</main>
        <footer className="text-center text-gray-400 text-sm py-8 mt-12">
          © 2026 測驗站
        </footer>
      </body>
    </html>
  )
}
