export interface User {
  id: string
  email: string
  username: string
  avatar_url?: string
  created_at: string
}

export interface NewsItem {
  id: string
  title: string
  summary: string
  source: string
  date: string
  url: string
  tag: string
  tag_class: string
  image_url?: string
}

export interface DailyNews {
  id: string
  date: string
  title: string
  summary: string
  content: NewsItem[]
  created_at: string
  updated_at: string
  likes_count?: number
  comments_count?: number
  user_liked?: boolean
}

export interface Comment {
  id: string
  daily_news_id: string
  user_id: string
  content: string
  parent_id?: string
  created_at: string
  updated_at: string
  user?: User
  replies?: Comment[]
}

export interface Like {
  id: string
  daily_news_id: string
  user_id: string
  created_at: string
}
