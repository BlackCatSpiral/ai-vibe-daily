'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthProvider'
import { Comment } from '@/types'
import { formatRelativeTime } from '@/utils'
import { MessageCircle, Send, Trash2, Heart, ChevronDown, ChevronUp } from 'lucide-react'
import { UserAvatar } from './UserAvatar'
import Link from 'next/link'

interface CommentsSectionProps {
  dailyNewsId: string
}

interface CommentItemProps {
  comment: Comment
  onReply: (parentId: string, content: string) => void
  onDelete: (commentId: string) => void
  onLike: (commentId: string) => void
  replyingTo: string | null
  setReplyingTo: (id: string | null) => void
  depth?: number
}

function CommentItem({ 
  comment, 
  onReply, 
  onDelete, 
  onLike,
  replyingTo, 
  setReplyingTo,
  depth = 0 
}: CommentItemProps) {
  const { user } = useAuth()
  const [replyContent, setReplyContent] = useState('')
  const [showReplies, setShowReplies] = useState(depth < 2)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyContent.trim()) return
    
    setIsSubmitting(true)
    await onReply(comment.id, replyContent.trim())
    setReplyContent('')
    setReplyingTo(null)
    setIsSubmitting(false)
  }

  const isReplying = replyingTo === comment.id
  const hasReplies = comment.replies && comment.replies.length > 0
  const canReply = depth < 3 // 最多3层嵌套

  return (
    <div className={`${depth > 0 ? 'ml-12 mt-4' : ''}`}>
      <div className="bg-card-bg border border-white/10 rounded-xl p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/profile/${comment.user?.username}`}>
              <UserAvatar user={comment.user} size="sm" />
            </Link>
            <div>
              <Link 
                href={`/profile/${comment.user?.username}`}
                className="font-medium text-white hover:text-neon-blue transition-colors"
              >
                {comment.user?.username || '未知用户'}
              </Link>
              <div className="text-sm text-gray-500">{formatRelativeTime(comment.created_at)}</div>
            </div>
          </div>
          
          {user?.id === comment.user_id && (
            <button
              onClick={() => onDelete(comment.id)}
              className="p-2 text-gray-500 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <p className="mt-3 text-gray-300 leading-relaxed">{comment.content}</p>
        
        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={() => onLike(comment.id)}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              comment.user_liked 
                ? 'text-red-400' 
                : 'text-gray-500 hover:text-red-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${comment.user_liked ? 'fill-current' : ''}`} />
            <span>{comment.likes_count || 0}</span>
          </button>
          
          {canReply && user && (
            <button
              onClick={() => setReplyingTo(isReplying ? null : comment.id)}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-neon-blue transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>回复</span>
            </button>
          )}
          
          
          {hasReplies && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-neon-blue transition-colors"
            >
              {showReplies ? (
                <><ChevronUp className="w-4 h-4" /><span>收起回复</span></>
              ) : (
                <><ChevronDown className="w-4 h-4" /><span>{comment.replies?.length} 条回复</span></>
              )}
            </button>
          )}
        </div>
      </div>

      {/* 回复输入框 */}
      {isReplying && (
        <form onSubmit={handleReplySubmit} className="mt-4 ml-12">
          <div className="flex gap-3">
            <div className="flex-1">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`回复 ${comment.user?.username}...`}
                className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-neon-blue focus:outline-none resize-none"
                rows={2}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !replyContent.trim()}
              className="px-4 py-3 bg-neon-blue text-black font-bold rounded-xl hover:bg-neon-blue/80 transition-colors disabled:opacity-50 self-end"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* 嵌套回复 */}
      {hasReplies && showReplies && (
        <div className="mt-4">
          {comment.replies?.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onDelete={onDelete}
              onLike={onLike}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function CommentsSection({ dailyNewsId }: CommentsSectionProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  useEffect(() => {
    fetchComments()
  }, [dailyNewsId])

  async function fetchComments() {
    setLoading(true)
    
    // 获取所有评论（包括嵌套的）
    const { data: commentsData } = await supabase
      .from('comments')
      .select(`
        *,
        user:profiles(id, username, avatar_url, bio)
      `)
      .eq('daily_news_id', dailyNewsId)
      .order('created_at', { ascending: true })

    if (commentsData) {
      // 获取评论点赞数
      const commentIds = commentsData.map((c: any) => c.id)
      const { data: likesData } = await supabase
        .from('comment_likes')
        .select('comment_id')
        .in('comment_id', commentIds)

      // 获取当前用户的点赞状态
      let userLikes: string[] = []
      if (user) {
        const { data: userLikesData } = await supabase
          .from('comment_likes')
          .select('comment_id')
          .in('comment_id', commentIds)
          .eq('user_id', user.id)
        userLikes = userLikesData?.map((l: any) => l.comment_id) || []
      }

      // 统计点赞数
      const likesCount: Record<string, number> = {}
      likesData?.forEach((like: any) => {
        likesCount[like.comment_id] = (likesCount[like.comment_id] || 0) + 1
      })

      // 构建嵌套结构
      const commentMap = new Map<string, Comment>()
      const rootComments: Comment[] = []

      // 先创建所有评论的映射
      commentsData.forEach((comment: any) => {
        commentMap.set(comment.id, {
          ...comment,
          likes_count: likesCount[comment.id] || 0,
          user_liked: userLikes.includes(comment.id),
          replies: []
        })
      })

      // 构建嵌套结构
      commentsData.forEach((comment: any) => {
        const enrichedComment = commentMap.get(comment.id)!
        if (comment.parent_id && commentMap.has(comment.parent_id)) {
          const parent = commentMap.get(comment.parent_id)!
          parent.replies = parent.replies || []
          parent.replies.push(enrichedComment)
        } else {
          rootComments.push(enrichedComment)
        }
      })

      // 按时间倒序排列根评论
      rootComments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      setComments(rootComments)
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

  async function handleReply(parentId: string, content: string) {
    if (!user) return

    const { error } = await supabase
      .from('comments')
      .insert({
        daily_news_id: dailyNewsId,
        user_id: user.id,
        content: content,
        parent_id: parentId
      } as any)

    if (!error) {
      fetchComments()
    }
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

  async function handleLike(commentId: string) {
    if (!user) {
      alert('请先登录')
      return
    }

    const comment = findComment(comments, commentId)
    if (!comment) return

    if (comment.user_liked) {
      // 取消点赞
      await supabase
        .from('comment_likes')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', user.id)
    } else {
      // 添加点赞
      await supabase
        .from('comment_likes')
        .insert({
          comment_id: commentId,
          user_id: user.id
        } as any)
    }

    fetchComments()
  }

  function findComment(comments: Comment[], id: string): Comment | null {
    for (const comment of comments) {
      if (comment.id === id) return comment
      if (comment.replies) {
        const found = findComment(comment.replies, id)
        if (found) return found
      }
    }
    return null
  }

  const totalComments = comments.reduce((sum, c) => {
    const countReplies = (comment: Comment): number => {
      return 1 + (comment.replies?.reduce((s, r) => s + countReplies(r), 0) || 0)
    }
    return sum + countReplies(c)
  }, 0)

  return (
    <div className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="w-6 h-6 text-neon-blue" />
        <h3 className="text-xl font-bold text-white">评论 ({totalComments})</h3>
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-3">
            <UserAvatar user={user as any} size="md" />
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
          <Link href="/login" className="text-neon-blue hover:underline">登录</Link>
          后可以发表评论
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-500">加载中...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">暂无评论，来抢沙发吧！</div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onDelete={handleDelete}
              onLike={handleLike}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
            />
          ))}
        </div>
      )}
    </div>
  )
}
