import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 安全地创建客户端
function createSafeClient() {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase credentials missing')
      return null
    }
    return createClient<Database>(supabaseUrl, supabaseAnonKey)
  } catch (e) {
    console.error('Failed to create Supabase client:', e)
    return null
  }
}

const client = createSafeClient()

// 导出一个安全的 supabase 对象，如果初始化失败则使用 mock
const mockSupabase = {
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    onAuthStateChange: (callback: any) => { 
      return { 
        data: { 
          subscription: { 
            unsubscribe: () => {} 
          } 
        } 
      }
    },
    signUp: async () => ({ data: null, error: new Error('Auth not available') }),
    signInWithPassword: async () => ({ data: null, error: new Error('Auth not available') }),
    signOut: async () => ({ error: null }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({ single: async () => ({ data: null, error: null }) }),
      order: () => ({ limit: () => ({ single: async () => ({ data: null, error: null }) }) }),
    }),
    insert: async () => ({ error: null }),
    delete: () => ({ eq: () => ({ eq: async () => ({ error: null }) }) }),
  }),
  rpc: async () => ({ data: 0, error: null }),
}

export const supabase = client || mockSupabase as any

export async function getCurrentUser() {
  if (!client) return null
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  return data
}

export async function signUp(email: string, password: string, username: string) {
  if (!client) return { data: null, error: new Error('Auth not available') }
  return await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } }
  })
}

export async function signIn(email: string, password: string) {
  if (!client) return { data: null, error: new Error('Auth not available') }
  return await supabase.auth.signInWithPassword({ email, password })
}

export async function signOut() {
  if (!client) return { error: null }
  return await supabase.auth.signOut()
}
