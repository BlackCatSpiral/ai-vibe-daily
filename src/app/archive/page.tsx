import Link from 'next/link'
import { formatDate } from '@/utils'
import { Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { unstable_noStore } from 'next/cache'

// 完全禁用缓存
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getAllNews() {
  // 确保不缓存
  unstable_noStore()
  
  const { data } = await supabase
    .from('daily_news')
    .select('id, date, title, summary')
    .order('date', { ascending: false })

  return data || []
}

export default async function ArchivePage() {
  const newsList = await getAllNews()

  return (
    <main className="min-h-screen pb-20">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-black font-orbitron mb-4">
            <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
              历史归档
            </span>
          </h1>
          <p className="text-gray-400">查看所有早报内容📚</p>
        </header>

        <div className="bg-card-bg border border-neon-blue/20 rounded-2xl p-6">
          {newsList.length === 0 ? (
            <div className="text-center py-12 text-gray-500">暂无文章📜</div>
          ) : (
            <ul className="divide-y divide-white/10">
              {newsList.map((news: any) => (
                <li key={news.id}>
                  <Link
                    href={`/news/${news.date}`}
                    className="block py-5 px-4 -mx-4 rounded-xl hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-white group-hover:text-neon-blue transition-colors mb-2">
                          {news.title}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-2">{news.summary}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-500 ml-4 shrink-0">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm whitespace-nowrap">{formatDate(news.date)}</span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  )
}
