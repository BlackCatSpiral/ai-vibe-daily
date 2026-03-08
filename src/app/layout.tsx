import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import { Navbar } from '@/components/Navbar'
import { AudioProvider } from '@/contexts/AudioContext'
import { BackgroundMusic } from '@/components/BackgroundMusic'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Vibe Coding 日报',
  description: '每日 AI 编程资讯，自动更新',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <AuthProvider>
          <AudioProvider>
            <Navbar />
            {children}
            <BackgroundMusic />
          </AudioProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
