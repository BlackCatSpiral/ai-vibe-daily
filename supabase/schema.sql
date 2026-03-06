-- 用户表（使用 Supabase Auth，这里存储扩展信息）
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 每日早报表
create table if not exists public.daily_news (
  id uuid default gen_random_uuid() primary key,
  date date unique not null,
  title text not null,
  summary text not null,
  content jsonb not null default '[]',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 评论表
create table if not exists public.comments (
  id uuid default gen_random_uuid() primary key,
  daily_news_id uuid references public.daily_news(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  parent_id uuid references public.comments(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 点赞表
create table if not exists public.likes (
  id uuid default gen_random_uuid() primary key,
  daily_news_id uuid references public.daily_news(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(daily_news_id, user_id)
);

-- 创建索引
create index if not exists comments_daily_news_id_idx on public.comments(daily_news_id);
create index if not exists comments_user_id_idx on public.comments(user_id);
create index if not exists comments_parent_id_idx on public.comments(parent_id);
create index if not exists likes_daily_news_id_idx on public.likes(daily_news_id);
create index if not exists likes_user_id_idx on public.likes(user_id);
create index if not exists daily_news_date_idx on public.daily_news(date);

-- 启用 RLS
alter table public.profiles enable row level security;
alter table public.daily_news enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;

-- Profiles RLS
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Daily News RLS
create policy "Daily news are viewable by everyone"
  on public.daily_news for select using (true);

-- Comments RLS
create policy "Comments are viewable by everyone"
  on public.comments for select using (true);

create policy "Authenticated users can create comments"
  on public.comments for insert with check (auth.uid() = user_id);

create policy "Users can update own comments"
  on public.comments for update using (auth.uid() = user_id);

create policy "Users can delete own comments"
  on public.comments for delete using (auth.uid() = user_id);

-- Likes RLS
create policy "Likes are viewable by everyone"
  on public.likes for select using (true);

create policy "Authenticated users can create likes"
  on public.likes for insert with check (auth.uid() = user_id);

create policy "Users can delete own likes"
  on public.likes for delete using (auth.uid() = user_id);

-- 函数：获取每日新闻的点赞数
create or replace function public.get_daily_news_likes(news_id uuid)
returns bigint as $$
  select count(*) from public.likes where daily_news_id = news_id;
$$ language sql security definer;

-- 函数：获取每日新闻的评论数
create or replace function public.get_daily_news_comments(news_id uuid)
returns bigint as $$
  select count(*) from public.comments where daily_news_id = news_id;
$$ language sql security definer;

-- 函数：检查用户是否点赞
create or replace function public.has_user_liked(news_id uuid, uid uuid)
returns boolean as $$
  select exists(select 1 from public.likes where daily_news_id = news_id and user_id = uid);
$$ language sql security definer;

-- 触发器：自动更新 updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger handle_daily_news_updated_at
  before update on public.daily_news
  for each row execute function public.handle_updated_at();

create trigger handle_comments_updated_at
  before update on public.comments
  for each row execute function public.handle_updated_at();

-- 触发器：新用户注册时自动创建 profile
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (new.id, new.raw_user_meta_data->>'username', null);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
