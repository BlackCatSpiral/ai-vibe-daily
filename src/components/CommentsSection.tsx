'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthProvider'
import { Comment } from '@/types'
import { formatRelativeTime } from '@/utils'
import { MessageCircle, Send, Trash2 } from 'lucide-react'

interface CommentsSectionProps {
  dailyNewsId: string
}

export function CommentsSection({ dailyNewsId }: CommentsSectionProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [dailyNewsId])

  async function fetchComments() {
    setLoading(true)
    const { data } = await supabase
      .from('comments')
      .select(`
        *,
        user:profiles(id, username, avatar_url)
      `)
      .eq('daily_news_id', dailyNewsId)
      .is('parent_id', null)
      .order('created_at', { ascending: false })

    if (data) {
      setComments(data as Comment[])
    }
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !newComment.trim()) return

    setSubmitting(true)
    const { error } = await supabase
      .from('comments')
      .insert({
        daily_news_id: dailyNewsId,
        user_id: user.id,
        content: newComment.trim()
      } as any)

    if (!error) {
      setNewComment('')
      fetchComments()
    }
    setSubmitting(false)
  }

  async function handleDelete(commentId: string) {
    if (!confirm('确定要删除这条评论吗？')) return

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)

    if (!error) {
      fetchComments()
    }
  }

  return (
    <div className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="w-6 h-6 text-neon-blue" />
        <h3 className="text-xl font-bold text-white">评论 ({comments.length})</h3>
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-3">
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="分享你的想法..."
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-neon-blue focus:outline-none resize-none"
                rows={3}
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="px-6 py-3 bg-neon-blue text-black font-bold rounded-xl hover:bg-neon-blue/80 transition-colors disabled:opacity-50 self-end"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-white/5 border border-white/10 rounded-xl text-center text-gray-400">
          登录后可以发表评论
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-500">加载中...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">暂无评论，来抢沙发吧！</div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-card-bg border border-white/10 rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-white font-bold">
                    {(comment.user?.username || 'U')[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-white">{comment.user?.username || '未知用户'}</div>
                    <div className="text-sm text-gray-500">{formatRelativeTime(comment.created_at)}</div>
                  </div>
                </div>
                
                {user?.id === comment.user_id && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <p className="mt-3 text-gray-300 leading-relaxed">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
