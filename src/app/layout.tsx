import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = { title: '測驗站 — 找出你是哪種人', description: '爆笑人格測驗，成分分析，看懂自己' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5477484686814211" crossOrigin="anonymous"></script>
      </head>
      <body className="bg-gray-50 min-h-screen">
        <header style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center">
            <a href="/" className="text-white font-black text-2xl tracking-tight">🧪 測驗站</a>
            <span className="ml-3 text-purple-200 text-sm">找出你是哪種人</span>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
