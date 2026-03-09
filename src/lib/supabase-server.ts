import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

// 服务端专用 - 使用 Service Role Key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseServer = createClient<Database>(supabaseUrl, supabaseServiceKey)
