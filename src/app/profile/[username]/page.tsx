import { notFound } from 'next/navigation'
import { supabaseServer } from '@/lib/supabase-server'
import { UserAvatar } from '@/components/UserAvatar'
import { formatDate } from '@/utils'
import Link from 'next/link'
import { ArrowLeft, MessageCircle, Heart, Calendar, User } from 'lucide-react'
import { unstable_noStore } from 'next/cache'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const dynamicParams = true

// 生成静态参数（ISR 回退）
export async function generateStaticParams() {
  return []
}

interface ProfilePageProps {
  params: {
    username: string
  }
}

async function getProfile(username: string) {
  unstable_noStore()
  
  console.log('[Profile] Fetching profile for username:', username)
  
  try {
    // 先检查环境变量
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('[Profile] SUPABASE_SERVICE_ROLE_KEY is not set')
      return { error: 'Server configuration error: Missing Service Role Key' }
    }

    const { data: profile, error } = await supabaseServer
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single()

    if (error) {
      console.error('[Profile] Supabase error:', error.message, error.code)
      return { error: `Database error: ${error.message} (${error.code})` }
    }

    if (!profile) {
      console.log('[Profile] No profile found for username:', username)
      return null
    }

    console.log('[Profile] Found profile:', profile.id, profile.username)
    const profileData = profile as any

    // 获取用户评论数
    const { count: commentsCount } = await supabaseServer
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', profileData.id)

    // 获取用户收到的点赞数
    const { data: userComments } = await supabaseServer
      .from('comments')
      .select('id')
      .eq('user_id', profileData.id)

    let likesReceived = 0
    if (userComments && userComments.length > 0) {
      const commentIds = (userComments as any[]).map(c => c.id)
      const { count } = await supabaseServer
        .from('comment_likes')
        .select('*', { count: 'exact', head: true })
        .in('comment_id', commentIds)
      likesReceived = count || 0
    }

    // 获取最近评论
    const { data: recentComments } = await supabaseServer
      .from('comments')
      .select(`
        *,
        daily_news:daily_news_id(date, title)
      `)
      .eq('user_id', profileData.id)
      .is('parent_id', null)
      .order('created_at', { ascending: false })
      .limit(10)

    return {
      profile: profileData,
      stats: {
        commentsCount: commentsCount || 0,
        likesReceived
      },
      recentComments: recentComments || []
    }
  } catch (err) {
    console.error('[Profile] Unexpected error:', err)
    return { error: String(err) }
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const username = params.username
  console.log('[ProfilePage] Rendering for username:', username)
  
  const result = await getProfile(username)

  // 如果出错，显示错误页面
  if (result && 'error' in result) {
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

          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-12 text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-4">
              服务器错误
            </h1>
            <p className="text-gray-300 mb-4">
              无法加载用户资料
            </p>
            <pre className="text-red-400 text-sm bg-black/30 p-4 rounded-lg overflow-auto">
              {result.error}
            </pre>
          </div>
        </div>
      </main>
    )
  }

  // 用户不存在
  if (!result) {
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

          <div className="bg-card-bg border border-white/10 rounded-2xl p-12 text-center">
            <User className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">
              用户未找到
            </h1>
            <p className="text-gray-400 mb-2">
              用户名: <span className="text-neon-blue">{username}</span>
            </p>
            <p className="text-gray-500 text-sm">
              该用户可能还没有注册，或者登录过一次系统。
            </p>
          </div>
        </div>
      </main>
    )
  }

  const { profile, stats, recentComments } = result

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

        <!-- 用户信息卡片 -->
        <div className="relative bg-card-bg border border-neon-blue/30 rounded-2xl p-8 mb-8 overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-neon-blue to-transparent" />
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <UserAvatar 
              user={profile as any} 
              size="xl" 
              className="border-4 border-neon-blue/20"
            />
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">
                {profile.username}
              </h1>
              
              {profile.bio ? (
                <p className="text-gray-300 mb-4 max-w-lg">{profile.bio}</p>
              ) : (
                <p className="text-gray-500 mb-4 italic">这个人很懒，还没有写个性签名...</p>
              )}
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="w-4 h-4 text-neon-blue" />
                  <span>加入于 {formatDate(profile.created_at)}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-400">
                  <MessageCircle className="w-4 h-4 text-neon-pink" />
                  <span>{stats.commentsCount} 条评论</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-400">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span>{stats.likesReceived} 次被赞</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 最近评论 -->
        <div className="bg-card-bg border border-white/10 rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"
          >
            <MessageCircle className="w-5 h-5 text-neon-blue" />
            最近评论
          </h2>

          {recentComments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              还没有发表过评论
            </div>
          ) : (
            <div className="space-y-4">
              {recentComments.map((comment: any) => (
                <div 
                  key={comment.id} 
                  className="border border-white/5 rounded-xl p-4 hover:border-neon-blue/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Link
                      href={`/news/${comment.daily_news?.date}`}
                      className="text-neon-blue hover:text-neon-pink transition-colors font-medium"
                    >
                      {comment.daily_news?.title || '未知早报'}
                    </Link>
                    <span className="text-sm text-gray-500">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 leading-relaxed">
                    {comment.content.length > 200 
                      ? comment.content.slice(0, 200) + '...' 
                      : comment.content
                    }
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
