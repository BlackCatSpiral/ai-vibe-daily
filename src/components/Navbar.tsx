'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from './AuthProvider'
import { signOut, signIn, signUp } from '@/lib/supabase'
import { User, LogOut, Menu, X, Settings, UserCircle } from 'lucide-react'
import { UserAvatar } from './UserAvatar'

export function Navbar() {
  const { user, refreshUser } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  async function handleLogout() {
    await signOut()
    await refreshUser()
    setShowUserMenu(false)
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-dark-bg/80 backdrop-blur-md border-b border-neon-blue/20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-white overflow-hidden">
                {/* 黑猫图标 */}
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-7 h-7" 
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* 猫头轮廓 */}
                  <path d="M12 2C9.5 2 7.5 3.5 6.5 5.5C5 6 4 7.5 4 9.5C4 13 6.5 16 10 17V19C10 19.5 10.5 20 11 20H13C13.5 20 14 19.5 14 19V17C17.5 16 20 13 20 9.5C20 7.5 19 6 17.5 5.5C16.5 3.5 14.5 2 12 2Z" />
                  {/* 耳朵 */}
                  <path d="M7 4L5 2V6L7 4Z" fill="#1a1a2e"/>
                  <path d="M17 4L19 2V6L17 4Z" fill="#1a1a2e"/>
                  {/* 眼睛 */}
                  <ellipse cx="9" cy="9" rx="1.5" ry="2" fill="#1a1a2e"/>
                  <ellipse cx="15" cy="9" rx="1.5" ry="2" fill="#1a1a2e"/>
                  {/* 鼻子 */}
                  <circle cx="12" cy="11.5" r="0.8" fill="#ff6b9d"/>
                  {/* 胡须 */}
                  <line x1="5" y1="11" x2="8" y2="11.5" stroke="#1a1a2e" strokeWidth="0.5"/>
                  <line x1="5" y1="12" x2="8" y2="11.5" stroke="#1a1a2e" strokeWidth="0.5"/>
                  <line x1="19" y1="11" x2="16" y2="11.5" stroke="#1a1a2e" strokeWidth="0.5"/>
                  <line x1="19" y1="12" x2="16" y2="11.5" stroke="#1a1a2e" strokeWidth="0.5"/>
                </svg>
              </div>
              <span className="text-white font-bold text-lg hidden sm:block">AI Vibe Daily</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-300 hover:text-neon-blue transition-colors">
                首页
              </Link>
              <Link href="/archive" className="text-gray-300 hover:text-neon-blue transition-colors">
                归档
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <UserAvatar user={user as any} size="md" />
                    <span className="hidden sm:block">{user.username}</span>
                  </button>

                  {/* 用户下拉菜单 */}
                  {showUserMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-48 bg-card-bg border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                        <Link
                          href={`/profile/${user.username}`}
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                        >
                          <UserCircle className="w-5 h-5" />
                          我的主页
                        </Link>
                        
                        <Link
                          href="/settings"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                        >
                          <Settings className="w-5 h-5" />
                          设置
                        </Link>
                        
                        <hr className="border-white/10" />
                        
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-red-400 transition-colors"
                        >
                          <LogOut className="w-5 h-5" />
                          退出登录
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-4 py-2 bg-neon-blue/20 text-neon-blue border border-neon-blue/50 rounded-lg hover:bg-neon-blue/30 transition-all"
                >
                  登录 / 注册
                </button>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-300"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-800">
              <div className="flex flex-col gap-3">
                <Link 
                  href="/" 
                  className="text-gray-300 hover:text-neon-blue py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  首页
                </Link>
                <Link 
                  href="/archive" 
                  className="text-gray-300 hover:text-neon-blue py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  归档
                </Link>
                {user && (
                  <>
                    <Link 
                      href={`/profile/${user.username}`}
                      className="text-gray-300 hover:text-neon-blue py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      我的主页
                    </Link>
                    <Link 
                      href="/settings"
                      className="text-gray-300 hover:text-neon-blue py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      设置
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </>
  )
}

function LoginModal({ onClose }: { onClose: () => void }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { refreshUser } = useAuth()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await signIn(email, password)
        if (error) throw error
      } else {
        const { error } = await signUp(email, password, username)
        if (error) throw error
      }
      
      await refreshUser()
      onClose()
    } catch (err: any) {
      setError(err.message || '操作失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-card-bg border border-neon-blue/30 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">{isLogin ? '登录' : '注册'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-neon-blue focus:outline-none"
              required
            />
          )}
          <input
            type="email"
            placeholder="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-neon-blue focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-neon-blue focus:outline-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? '处理中...' : isLogin ? '登录' : '注册'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-neon-blue hover:underline text-sm"
          >
            {isLogin ? '还没有账号？去注册' : '已有账号？去登录'}
          </button>
        </div>
      </div>
    </div>
  )
}
