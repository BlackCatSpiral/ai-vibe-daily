import { notFound } from 'next/navigation'
import { formatDate } from '@/utils'
import { NewsCard } from '@/components/NewsCard'
import { LikeButton } from '@/components/LikeButton'
import { CommentsSection } from '@/components/CommentsSection'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface Props {
  params: { date: string }
}

async function getNewsByDate(date: string) {
  const { data } = await supabase
    .from('daily_news')
    .select('*')
    .eq('date', date)
    .single()

  if (!data) return null

  const newsData = data as any

  const { data: likesCount } = await supabase
    .rpc('get_daily_news_likes', { news_id: newsData.id } as any)

  return {
    ...newsData,
    likes_count: likesCount || 0
  }
}

export default async function NewsPage({ params }: Props) {
  const news = await getNewsByDate(params.date)

  if (!news) {
    notFound()
  }

  // 安全解析 content
  let content: any[] = []
  if (news.content) {
    if (Array.isArray(news.content)) {
      content = news.content
    } else if (typeof news.content === 'string') {
      try {
        const parsed = JSON.parse(news.content)
        content = Array.isArray(parsed) ? parsed : []
      } catch {
        content = []
      }
    }
  }

  return (
    <main className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-neon-blue transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          返回首页
        </Link>

        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black font-orbitron mb-4">
            <span className="bg-gradient-to-r from-neon-blue via-neon-pink to-neon-purple bg-clip-text text-transparent">
              黑猫的AI每日报
            </span>
          </h1>
          
          <p className="font-orbitron text-neon-blue tracking-widest">{formatDate(news.date)}</p>
        </header>

        <div className="relative bg-card-bg border border-neon-blue/30 rounded-2xl p-8 mb-10 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-neon-blue to-transparent" />
          
          <h2 className="flex items-center gap-2 text-neon-blue font-orbitron text-sm uppercase tracking-wider mb-4">
            <span>◆</span>
            每日摘要
          </h2>
          
          <p className="text-gray-300 text-lg leading-relaxed">{news.summary}</p>
          
          <div className="mt-6 flex items-center gap-4">
            <LikeButton 
              dailyNewsId={news.id} 
              initialLikes={news.likes_count}
            />
          </div>
        </div>

        {content.length > 0 ? (
          <div className="grid gap-6">
            {content.map((item, index) => (
              <NewsCard key={item.id || index} item={item} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            该日期暂无详细新闻内容
          </div>
        )}

        <CommentsSection dailyNewsId={news.id} />
      </div>
    </main>
  )
}
