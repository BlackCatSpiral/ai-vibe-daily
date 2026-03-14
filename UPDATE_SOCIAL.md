# AI Vibe Daily 社交功能更新

## 新增功能

1. **用户头像和个性签名**
   - 用户可以在设置页面上传头像（支持 JPG/PNG，最大 2MB）
   - 可以设置个性签名（最多 200 字符）

2. **个人主页**
   - 访问 `/profile/[username]` 查看用户主页
   - 显示用户信息、统计（评论数、被赞数）、最近评论

3. **嵌套评论**
   - 支持最多 3 层嵌套回复
   - 可以收起/展开回复

4. **评论点赞**
   - 可以给评论点赞/取消点赞
   - 显示每条评论的点赞数

## 数据库更新

在 Supabase SQL Editor 中执行以下 SQL：

```sql
-- 1. 添加 bio 字段到 profiles 表
alter table public.profiles add column if not exists bio text;

-- 2. 创建评论点赞表
create table if not exists public.comment_likes (
  id uuid default gen_random_uuid() primary key,
  comment_id uuid references public.comments(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(comment_id, user_id)
);

-- 3. 创建索引
create index if not exists comment_likes_comment_id_idx on public.comment_likes(comment_id);
create index if not exists comment_likes_user_id_idx on public.comment_likes(user_id);

-- 4. 启用 RLS
alter table public.comment_likes enable row level security;

-- 5. 添加 RLS 策略
create policy "Comment likes are viewable by everyone"
  on public.comment_likes for select using (true);

create policy "Authenticated users can create comment likes"
  on public.comment_likes for insert with check (auth.uid() = user_id);

create policy "Users can delete own comment likes"
  on public.comment_likes for delete using (auth.uid() = user_id);

-- 6. 更新触发器函数，包含 bio 字段
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url, bio)
  values (new.id, new.raw_user_meta_data->>'username', null, null);
  return new;
end;
$$ language plpgsql security definer;

-- 7. 创建存储桶用于头像上传
-- 在 Supabase Dashboard -> Storage -> New Bucket 中创建：
-- Bucket name: avatars
-- Public: 启用
```

## 部署步骤

1. **执行数据库更新**
   - 登录 Supabase Dashboard
   - 进入 SQL Editor
   - 执行上述 SQL 语句
   - 在 Storage 中创建 `avatars` bucket（public）

2. **部署前端**
   ```bash
   cd ai-vibe-daily-app
   npm install
   npm run build
   # 部署到 Vercel
   ```

3. **验证功能**
   - 登录账号
   - 进入 `/settings` 设置头像和签名
   - 访问 `/profile/[你的用户名]` 查看个人主页
   - 在新闻详情页测试嵌套评论和评论点赞

## 新页面路由

- `/settings` - 个人设置
- `/profile/[username]` - 用户主页

## 文件变更

### 新增文件
- `src/components/UserAvatar.tsx` - 用户头像组件
- `src/app/profile/[username]/page.tsx` - 个人主页
- `src/app/settings/page.tsx` - 设置页面

### 修改文件
- `supabase/schema.sql` - 数据库 schema 更新
- `src/types/index.ts` - 类型定义更新
- `src/components/CommentsSection.tsx` - 支持嵌套评论和点赞
- `src/components/Navbar.tsx` - 添加用户菜单
