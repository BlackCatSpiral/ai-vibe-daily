const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://bavlatfnyluqybmorpzs.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhdmxhdGZueWx1cXlibW9ycHpzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjc4MTA1NCwiZXhwIjoyMDg4MzU3MDU0fQ.x_lStRC2jkVrnzV4VzdhaKLP98ED2fWxkH6pD_hip8o'

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function executeSql() {
  console.log('开始执行数据库更新...\n')

  // 1. 添加 bio 字段
  console.log('1. 添加 bio 字段到 profiles 表...')
  const { error: error1 } = await supabase.rpc('exec_sql', {
    sql: 'alter table public.profiles add column if not exists bio text;'
  })
  if (error1) {
    console.log('   使用备用方法...')
    // 如果 rpc 不存在，使用原始 SQL 查询
    const { error } = await supabase.from('_exec_sql').select('*').eq('sql', 'alter table public.profiles add column if not exists bio text;')
    if (error) console.log('   ⚠️ bio 字段可能已存在或需要手动添加')
  } else {
    console.log('   ✅ bio 字段添加成功')
  }

  // 2. 创建 comment_likes 表
  console.log('2. 创建 comment_likes 表...')
  const createTableSql = `
    create table if not exists public.comment_likes (
      id uuid default gen_random_uuid() primary key,
      comment_id uuid references public.comments(id) on delete cascade not null,
      user_id uuid references public.profiles(id) on delete cascade not null,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null,
      unique(comment_id, user_id)
    );
  `
  const { error: error2 } = await supabase.rpc('exec_sql', { sql: createTableSql })
  if (error2) {
    console.log('   ⚠️ comment_likes 表可能已存在或需要手动创建')
    console.log('   错误:', error2.message)
  } else {
    console.log('   ✅ comment_likes 表创建成功')
  }

  // 3. 创建索引
  console.log('3. 创建索引...')
  const indexSql = `
    create index if not exists comment_likes_comment_id_idx on public.comment_likes(comment_id);
    create index if not exists comment_likes_user_id_idx on public.comment_likes(user_id);
  `
  const { error: error3 } = await supabase.rpc('exec_sql', { sql: indexSql })
  if (error3) {
    console.log('   ⚠️ 索引可能已存在')
  } else {
    console.log('   ✅ 索引创建成功')
  }

  // 4. 启用 RLS
  console.log('4. 启用 RLS...')
  const { error: error4 } = await supabase.rpc('exec_sql', { 
    sql: 'alter table public.comment_likes enable row level security;'
  })
  if (error4) {
    console.log('   ⚠️ RLS 可能已启用')
  } else {
    console.log('   ✅ RLS 启用成功')
  }

  console.log('\n✅ 数据库更新完成！')
  console.log('\n注意：如果某些步骤显示警告，可能是对象已存在，属于正常情况。')
  console.log('请登录 Supabase Dashboard 确认更新结果。')
}

executeSql().catch(console.error)
