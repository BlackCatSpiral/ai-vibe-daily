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
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-white font-bold">
                AI
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
                    <UserAvatar user={user as any} size="sm" />
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
