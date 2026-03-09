'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  async function getUser() {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (authUser) {
        const { data } = await supabase
          .from('profiles')
          .select('id, username, avatar_url, created_at')
          .eq('id', authUser.id)
          .single()
        
        const profile = data as any
        
        if (profile) {
          setUser({
            id: profile.id,
            email: authUser.email!,
            username: profile.username || '',
            avatar_url: profile.avatar_url || undefined,
            created_at: profile.created_at
          })
        }
      } else {
        setUser(null)
      }
    } catch (e) {
      console.error('Auth error:', e)
      setUser(null)
    }
    setLoading(false)
  }

  useEffect(() => {
    getUser()

    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
        getUser()
      })

      return () => subscription.unsubscribe()
    } catch (e) {
      console.error('Auth state change error:', e)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser: getUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
