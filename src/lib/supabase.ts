import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

// 从环境变量获取配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// 创建默认的 mock 客户端（防止 undefined 错误）
const createMockClient = () => {
  const mockAuth = {
    getUser: async () => ({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({ 
      data: { 
        subscription: { 
          unsubscribe: () => {} 
        } 
      } 
    }),
    signUp: async () => ({ data: { user: null, session: null }, error: new Error('Auth not available') }),
    signInWithPassword: async () => ({ data: { user: null, session: null }, error: new Error('Auth not available') }),
    signOut: async () => ({ error: null }),
  }

  const mockFrom = () => ({
    select: () => ({
      eq: () => ({ 
        single: async () => ({ data: null, error: null }),
        maybeSingle: async () => ({ data: null, error: null }),
      }),
      order: () => ({ 
        limit: () => ({ single: async () => ({ data: null, error: null }) }),
      }),
    }),
    insert: async () => ({ data: null, error: null }),
    update: async () => ({ data: null, error: null }),
    delete: () => ({ eq: () => ({ eq: async () => ({ data: null, error: null }) }) }),
  })

  return {
    auth: mockAuth,
    from: mockFrom,
    rpc: async () => ({ data: 0, error: null }),
  } as any
}

// 安全地创建客户端
let realClient: any = null

try {
  if (supabaseUrl && supabaseAnonKey) {
    realClient = createClient<Database>(supabaseUrl, supabaseAnonKey)
  }
} catch (e) {
  console.warn('Failed to create Supabase client:', e)
}

// 导出 supabase 客户端 - 确保永远不会是 undefined
export const supabase = realClient || createMockClient()

// 导出辅助函数
export async function getCurrentUser() {
  if (!realClient) return null
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    return data
  } catch (e) {
    return null
  }
}

export async function signUp(email: string, password: string, username: string) {
  try {
    return await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } }
    })
  } catch (e) {
    return { data: null, error: e }
  }
}

export async function signIn(email: string, password: string) {
  try {
    return await supabase.auth.signInWithPassword({ email, password })
  } catch (e) {
    return { data: null, error: e }
  }
}

export async function signOut() {
  try {
    return await supabase.auth.signOut()
  } catch (e) {
    return { error: e }
  }
}
