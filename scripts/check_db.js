const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://bavlatfnyluqybmorpzs.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhdmxhdGZueWx1cXlibW9ycHpzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjc4MTA1NCwiZXhwIjoyMDg4MzU3MDU0fQ.x_lStRC2jkVrnzV4VzdhaKLP98ED2fWxkH6pD_hip8o'

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function checkAndUpdateDb() {
  console.log('检查数据库状态...\n')

  // 检查 profiles 表是否有 bio 字段
  console.log('1. 检查 profiles 表的 bio 字段...')
  const { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)
  
  if (profilesError) {
    console.log('   ❌ 无法访问 profiles 表:', profilesError.message)
  } else {
    const hasBio = profilesData.length > 0 && 'bio' in profilesData[0]
    console.log(hasBio ? '   ✅ bio 字段已存在' : '   ⚠️ bio 字段不存在，需要添加')
  }

  // 检查 comment_likes 表是否存在
  console.log('2. 检查 comment_likes 表...')
  const { data: likesData, error: likesError } = await supabase
    .from('comment_likes')
    .select('*')
    .limit(1)
  
  if (likesError && likesError.code === '42P01') {
    console.log('   ⚠️ comment_likes 表不存在，需要创建')
  } else if (likesError) {
    console.log('   ⚠️ comment_likes 表访问错误:', likesError.message)
  } else {
    console.log('   ✅ comment_likes 表已存在')
  }

  // 检查 avatars bucket
  console.log('3. 检查 avatars storage bucket...')
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
  
  if (bucketError) {
    console.log('   ❌ 无法获取 buckets:', bucketError.message)
  } else {
    const avatarsBucket = buckets.find(b => b.name === 'avatars')
    console.log(avatarsBucket ? '   ✅ avatars bucket 已存在' : '   ⚠️ avatars bucket 不存在，需要创建')
  }

  console.log('\n📋 需要手动执行的 SQL:')
  console.log('```sql')
  console.log('-- 1. 添加 bio 字段')
  console.log('alter table public.profiles add column if not exists bio text;')
  console.log('')
  console.log('-- 2. 创建 comment_likes 表')
  console.log(`create table if not exists public.comment_likes (
  id uuid default gen_random_uuid() primary key,
  comment_id uuid references public.comments(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(comment_id, user_id)
);`)
  console.log('')
  console.log('-- 3. 创建索引')
  console.log('create index if not exists comment_likes_comment_id_idx on public.comment_likes(comment_id);')
  console.log('create index if not exists comment_likes_user_id_idx on public.comment_likes(user_id);')
  console.log('')
  console.log('-- 4. 启用 RLS')
  console.log('alter table public.comment_likes enable row level security;')
  console.log('')
  console.log('-- 5. RLS 策略')
  console.log(`create policy "Comment likes are viewable by everyone"
  on public.comment_likes for select using (true);

create policy "Authenticated users can create comment likes"
  on public.comment_likes for insert with check (auth.uid() = user_id);

create policy "Users can delete own comment likes"
  on public.comment_likes for delete using (auth.uid() = user_id);`)
  console.log('```')
  console.log('\n📋 需要手动创建的 Storage Bucket:')
  console.log('- Bucket name: avatars')
  console.log('- Public: 启用')
  console.log('- 路径: Supabase Dashboard -> Storage -> New Bucket')
}

checkAndUpdateDb().catch(console.error)
