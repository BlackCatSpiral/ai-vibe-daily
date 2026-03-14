'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'
import { UserAvatar } from '@/components/UserAvatar'
import { Camera, Save, Loader2 } from 'lucide-react'

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [profile, setProfile] = useState<any>(null)
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }
    
    if (user) {
      fetchProfile()
    }
  }, [user, authLoading, router])

  async function fetchProfile() {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user!.id)
      .single()

    if (data) {
      setProfile(data)
      setBio(data.bio || '')
      setAvatarUrl(data.avatar_url)
    }
  }

  async function uploadAvatar(file: File) {
    try {
      setUploading(true)
      
      // 检查并创建 bucket
      const { data: buckets } = await supabase.storage.listBuckets()
      const avatarsBucket = buckets?.find((b: any) => b.name === 'avatars')
      
      if (!avatarsBucket) {
        await supabase.storage.createBucket('avatars', {
          public: true
        })
      }

      // 生成文件名
      const fileExt = file.name.split('.').pop()
      const fileName = `${user!.id}-${Date.now()}.${fileExt}`
      
      // 上传文件
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // 获取 URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      setAvatarUrl(publicUrl)
      setMessage('头像上传成功！')
    } catch (error: any) {
      setMessage(`上传失败: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      setMessage('请选择图片文件')
      return
    }

    // 验证文件大小（最大 2MB）
    if (file.size > 2 * 1024 * 1024) {
      setMessage('图片大小不能超过 2MB')
      return
    }

    uploadAvatar(file)
  }

  async function handleSave() {
    if (!user) return

    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({
        bio: bio.trim() || null,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (error) {
      setMessage(`保存失败: ${error.message}`)
    } else {
      setMessage('保存成功！')
    }
    setSaving(false)
  }

  if (authLoading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neon-blue" />
      </div>
    )
  }

  return (
    <main className="min-h-screen pb-20">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">个人设置</h1>

        {message && (
          <div className={`mb-6 p-4 rounded-xl ${
            message.includes('失败') 
              ? 'bg-red-500/10 border border-red-500/30 text-red-400' 
              : 'bg-green-500/10 border border-green-500/30 text-green-400'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-card-bg border border-white/10 rounded-2xl p-8 space-y-8">
          {/* 头像设置 */}
          <div className="flex flex-col items-center">
            <label className="text-sm font-medium text-gray-400 mb-4">头像</label>
            
            <div className="relative">
              <UserAvatar 
                user={{ ...profile, avatar_url: avatarUrl }} 
                size="xl" 
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 w-10 h-10 bg-neon-blue text-black rounded-full flex items-center justify-center hover:bg-neon-blue/80 transition-colors disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Camera className="w-5 h-5" />
                )}
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            
            <p className="mt-4 text-sm text-gray-500">
              支持 JPG、PNG 格式，最大 2MB
            </p>
          </div>

          {/* 用户名（只读） */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              用户名
            </label>
            <input
              type="text"
              value={profile.username}
              disabled
              className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-xl text-gray-500 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">用户名无法修改</p>
          </div>

          {/* 个性签名 */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              个性签名
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="写点什么介绍自己..."
              maxLength={200}
              rows={3}
              className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-neon-blue focus:outline-none resize-none"
            />
            <div className="mt-1 text-right text-xs text-gray-500">
              {bio.length}/200
            </div>
          </div>

          {/* 保存按钮 */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-4 bg-neon-blue text-black font-bold rounded-xl hover:bg-neon-blue/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <><Loader2 className="w-5 h-5 animate-spin" />保存中...</>
            ) : (
              <><Save className="w-5 h-5" />保存设置</>
            )}
          </button>
        </div>
      </div>
    </main>
  )
}
