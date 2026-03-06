import { formatDate } from '@/utils'
import { NewsCard } from '@/components/NewsCard'
import { CommentsSection } from '@/components/CommentsSection'
import { LikeButton } from '@/components/LikeButton'
import { supabase } from '@/lib/supabase'

async function getLatestNews() {
  const { data } = await supabase
    .from('daily_news')
    .select('*')
    .order('date', { ascending: false })
    .limit(1)
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

export default async function HomePage() {
  const news = await getLatestNews()

  if (!news) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">暂无内容，请稍后查看📰</p>
        </div>
      </div>
    )
  }

  const content = (news.content as any[]) || []

  return (
    <main className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <img 
              src="https://blackcatspiral.github.io/ai-vibe-coding-daily/black-cat-avatar.jpg" 
              alt="黑猫" 
              className="w-28 h-28 rounded-full object-cover border-2 border-neon-blue"
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black font-orbitron mb-4">
            <span className="bg-gradient-to-r from-neon-blue via-neon-pink to-neon-purple bg-clip-text text-transparent">
              黑猫的AI每日报
            </span>
          </h1>
          
          <p className="font-orbitron text-neon-blue tracking-widest">{formatDate(news.date)}</p>
        </header>

        {/* Summary */}
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

        {/* News Grid */}
        {content.length > 0 ? (
          <div className="grid gap-6">
            {content.map((item, index) => (
              <NewsCard key={item.id || index} item={item} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            暂无详细新闻内容
          </div>
        )}

        {/* Comments */}
        <CommentsSection dailyNewsId={news.id} />

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-white/10">
          <p className="font-orbitron text-gray-500 tracking-wider">
            黑猫的AI每日报 · 每日更新
          </p>
        </footer>
      </div>
    </main>
  )
}
