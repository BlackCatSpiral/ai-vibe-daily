import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

// 服务端专用 - 使用 Service Role Key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// 验证环境变量
if (!supabaseUrl) {
  console.error('[Supabase Server] NEXT_PUBLIC_SUPABASE_URL is not set')
}
if (!supabaseServiceKey) {
  console.error('[Supabase Server] SUPABASE_SERVICE_ROLE_KEY is not set')
}

export const supabaseServer = createClient<Database>(
  supabaseUrl || '',
  supabaseServiceKey || ''
)
