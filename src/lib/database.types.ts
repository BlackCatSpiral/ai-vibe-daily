export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      daily_news: {
        Row: {
          id: string
          date: string
          title: string
          summary: string
          content: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          date: string
          title: string
          summary: string
          content?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          date?: string
          title?: string
          summary?: string
          content?: Json
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          daily_news_id: string
          user_id: string
          content: string
          parent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          daily_news_id: string
          user_id: string
          content: string
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          daily_news_id?: string
          user_id?: string
          content?: string
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          daily_news_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          daily_news_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          daily_news_id?: string
          user_id?: string
          created_at?: string
        }
      }
    }
    Functions: {
      get_daily_news_likes: {
        Args: { news_id: string }
        Returns: number
      }
      get_daily_news_comments: {
        Args: { news_id: string }
        Returns: number
      }
      has_user_liked: {
        Args: { news_id: string; uid: string }
        Returns: boolean
      }
    }
  }
}
