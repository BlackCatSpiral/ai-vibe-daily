import { formatDate } from '@/utils'
import { LikeButton } from '@/components/LikeButton'
import { CommentsSection } from '@/components/CommentsSection'
import { SafeImage } from '@/components/SafeImage'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { unstable_noStore } from 'next/cache'

const tagStyles: Record<string, string> = {
  crisis: 'bg-red-500/10 text-red-400 border-red-500/30',
  security: 'bg-red-500/10 text-red-400 border-red-500/30',
  update: 'bg-neon-blue/10 text-neon-blue border-neon-blue/30',
  trend: 'bg-green-500/10 text-green-400 border-green-500/30',
  strategy: 'bg-neon-pink/10 text-neon-pink border-neon-pink/30',
  default: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
}

// 完全禁用缓存，确保每次请求都获取最新数据
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PageProps {
  params: {
    date: string
  }
}

async function getNewsByDate(date: string) {
  // 确保不缓存
  unstable_noStore()
  
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

export default async function NewsPage({ params }: PageProps) {
  const news = await getNewsByDate(params.date)

  if (!news) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        未找到该日期的新闻
      </div>
    )
  }

  const content = (news.content as any[]) || []

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
            <LikeButton dailyNewsId={news.id} initialLikes={news.likes_count} />
          </div>
        </div>

        {/* News Grid - 直接内联渲染 */}
        {content.length > 0 ? (
          <div className="grid gap-6">
            {content.map((item: any, index: number) => {
              const tagClass = tagStyles[item.tag_class] || tagStyles.default
              const imageUrl = item.image || item.image_url
              
              return (
                <article 
                  key={item.id || index} 
                  className="group relative bg-card-bg border border-neon-blue/20 rounded-2xl overflow-hidden transition-all duration-400 hover:-translate-y-2 hover:border-neon-blue hover:shadow-[0_20px_60px_rgba(0,245,255,0.2)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 via-transparent to-neon-pink/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  
                  <SafeImage
                    src={imageUrl}
                    alt={item.title}
                    className="w-full h-52 object-cover border-b border-neon-blue/10"
                  />
                  
                  <div className="p-6">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full border mb-4 ${tagClass}`}>
                      {item.tag}
                    </span>
                    
                    <h3 className="text-xl font-bold text-white mb-3 leading-snug">{item.title}</h3>
                    
                    <p className="text-gray-400 leading-relaxed mb-4">{item.summary}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-white/10 text-sm">
                      <span className="text-neon-pink">{item.source}</span>
                      <span className="text-gray-500">{item.date}</span>
                      <Link
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-neon-blue hover:text-neon-pink transition-all hover:gap-2"
                      >
                        阅读全文 →
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
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
