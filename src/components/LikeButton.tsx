'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthProvider'
import { Heart } from 'lucide-react'
import { cn } from '@/utils'

interface LikeButtonProps {
  dailyNewsId: string
  initialLikes?: number
  initialLiked?: boolean
}

export function LikeButton({ dailyNewsId, initialLikes = 0, initialLiked = false }: LikeButtonProps) {
  const { user } = useAuth()
  const [likes, setLikes] = useState(initialLikes)
  const [liked, setLiked] = useState(initialLiked)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchLikes()
  }, [dailyNewsId])

  async function fetchLikes() {
    const { data: count } = await supabase
      .rpc('get_daily_news_likes', { news_id: dailyNewsId } as any)
    
    if (count !== null) {
      setLikes(count)
    }

    if (user) {
      const { data: hasLiked } = await supabase
        .rpc('has_user_liked', { news_id: dailyNewsId, uid: user.id } as any)
      
      setLiked(hasLiked || false)
    }
  }

  async function handleLike() {
    if (!user) {
      alert('请先登录后再点赞')
      return
    }

    setLoading(true)

    try {
      if (liked) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('daily_news_id', dailyNewsId)
          .eq('user_id', user.id)
        
        if (error) throw error
        setLiked(false)
        setLikes(prev => prev - 1)
      } else {
        const { error } = await supabase
          .from('likes')
          .insert({
            daily_news_id: dailyNewsId,
            user_id: user.id
          } as any)
        
        if (error) throw error
        setLiked(true)
        setLikes(prev => prev + 1)
      }
    } catch (err) {
      console.error('Like error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-full border transition-all',
        liked
          ? 'bg-neon-pink/20 border-neon-pink text-neon-pink'
          : 'bg-white/5 border-white/20 text-gray-400 hover:border-neon-pink hover:text-neon-pink'
      )}
    >
      <Heart className={cn('w-5 h-5', liked && 'fill-current')} />
      <span>{likes}</span>
    </button>
  )
}
