import { ArchiveContent } from '@/components/ArchiveContent'
import { supabaseServer } from '@/lib/supabase-server'
import { unstable_noStore } from 'next/cache'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface NewsItem {
  id: string
  date: string
  title: string
  summary: string
}

async function getAllNews(): Promise<NewsItem[]> {
  unstable_noStore()
  
  const { data, error } = await supabaseServer
    .from('daily_news')
    .select('id, date, title, summary')
    .order('date', { ascending: false })
  
  if (error) {
    console.error('[Archive] Supabase error:', error)
    return []
  }
  
  return data || []
}

export default async function ArchivePage() {
  const newsList = await getAllNews()

  return (
    <main className="min-h-screen pb-20">
      <ArchiveContent newsList={newsList} />
    </main>
  )
}
