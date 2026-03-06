import { DailyNews, NewsItem, Comment, User } from '@/types'

// 使用真实的 UUID 格式
const NEWS_IDS = {
  '2026-03-06': 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  '2026-03-05': 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
  '2026-03-04': 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
  '2026-03-03': 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
  '2026-03-02': 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'
}

// Mock 数据 - 用于静态构建
export const mockLatestNews: DailyNews = {
  id: NEWS_IDS['2026-03-06'],
  date: '2026-03-06',
  title: 'AI Vibe Coding 早报',
  summary: '今日AI Vibe Coding领域关注：Claude Code 2025年3月全量开放、Vibe Coding成为2025年编程新范式、OpenAI Codex App正式上线，月活开发者突破100万等最新动态。',
  content: [
    {
      id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01',
      title: 'Claude Code 2025年3月全量开放',
      summary: 'Anthropic宣布Claude Code正式全量开放，所有开发者都可以使用这一AI编程助手。新版本支持更复杂的代码重构任务，准确率提升40%。',
      source: 'Anthropic Blog',
      date: '2026-03-06',
      url: 'https://www.anthropic.com',
      tag: '重大更新',
      tag_class: 'update'
    },
    {
      id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 
      title: 'Vibe Coding成为2025年编程新范式',
      summary: '随着AI辅助编程工具的普及，Vibe Coding正在成为一种新的编程范式。开发者更多地专注于创意和架构，而非具体实现细节。',
      source: 'TechCrunch',
      date: '2026-03-06',
      url: 'https://techcrunch.com',
      tag: '行业趋势',
      tag_class: 'trend'
    },
    {
      id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03',
      title: 'OpenAI Codex App月活突破100万',
      summary: 'OpenAI宣布Codex App正式上线后月活用户已突破100万。该应用支持iOS和Android平台，让开发者随时随地进行AI辅助编程。',
      source: 'OpenAI Blog',
      date: '2026-03-06',
      url: 'https://openai.com',
      tag: '产品发布',
      tag_class: 'update'
    },
    {
      id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04',
      title: 'AI生成代码质量引发讨论',
      summary: '最新研究显示，AI生成的代码在安全性方面仍需人工审核。专家建议建立AI代码审查流程，确保生产环境代码质量。',
      source: 'InfoQ',
      date: '2026-03-06',
      url: 'https://www.infoq.com',
      tag: '安全提醒',
      tag_class: 'security'
    },
    {
      id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05',
      title: 'GitHub Copilot新增团队协作功能',
      summary: 'GitHub宣布Copilot新增团队共享代码库功能，支持团队成员共享AI编程配置和代码片段，提升团队协作效率。',
      source: 'GitHub Blog',
      date: '2026-03-06',
      url: 'https://github.blog',
      tag: '功能更新',
      tag_class: 'update'
    }
  ] as NewsItem[],
  created_at: '2026-03-06T00:00:00Z',
  updated_at: '2026-03-06T00:00:00Z',
  likes_count: 42,
  comments_count: 8
}

export const mockAllNews: DailyNews[] = [
  mockLatestNews,
  {
    id: NEWS_IDS['2026-03-05'],
    date: '2026-03-05',
    title: 'AI Vibe Coding 早报',
    summary: '昨日AI领域关注：OpenClaw发布重大更新、AI Slopageddon引发开源危机、Claude Code安全漏洞曝光等动态。',
    content: [],
    created_at: '2026-03-05T00:00:00Z',
    updated_at: '2026-03-05T00:00:00Z'
  },
  {
    id: NEWS_IDS['2026-03-04'],
    date: '2026-03-04',
    title: 'AI Vibe Coding 早报',
    summary: 'Cursor AI发布0.45版本，支持多模态代码生成；Stack Overflow 2025开发者调查显示AI工具使用率激增。',
    content: [],
    created_at: '2026-03-04T00:00:00Z',
    updated_at: '2026-03-04T00:00:00Z'
  },
  {
    id: NEWS_IDS['2026-03-03'],
    date: '2026-03-03',
    title: 'AI Vibe Coding 早报',
    summary: 'Google发布Gemini Code Assist企业版；微软Build 2025宣布Copilot深度集成Windows 12。',
    content: [],
    created_at: '2026-03-03T00:00:00Z',
    updated_at: '2026-03-03T00:00:00Z'
  },
  {
    id: NEWS_IDS['2026-03-02'],
    date: '2026-03-02',
    title: 'AI Vibe Coding 早报',
    summary: 'Replit Agent 2.0发布，支持一键部署到云端；Vercel AI SDK更新，支持流式响应优化。',
    content: [],
    created_at: '2026-03-02T00:00:00Z',
    updated_at: '2026-03-02T00:00:00Z'
  }
]

export const mockComments: Comment[] = [
  {
    id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01',
    daily_news_id: NEWS_IDS['2026-03-06'],
    user_id: 'user1',
    content: 'Claude Code 确实好用，最近一直在用！',
    created_at: '2026-03-06T08:30:00Z',
    updated_at: '2026-03-06T08:30:00Z',
    user: {
      id: 'user1',
      email: 'user1@example.com',
      username: 'CodeMaster',
      created_at: '2026-01-01T00:00:00Z'
    }
  },
  {
    id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02',
    daily_news_id: NEWS_IDS['2026-03-06'],
    user_id: 'user2',
    content: 'Vibe Coding 这个概念很有意思，感觉确实改变了开发方式',
    created_at: '2026-03-06T09:15:00Z',
    updated_at: '2026-03-06T09:15:00Z',
    user: {
      id: 'user2',
      email: 'user2@example.com',
      username: 'AIFan',
      created_at: '2026-02-01T00:00:00Z'
    }
  },
  {
    id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03',
    daily_news_id: NEWS_IDS['2026-03-06'],
    user_id: 'user3',
    content: '期待更多AI编程工具的更新！',
    created_at: '2026-03-06T10:00:00Z',
    updated_at: '2026-03-06T10:00:00Z',
    user: {
      id: 'user3',
      email: 'user3@example.com',
      username: 'DevNewbie',
      created_at: '2026-03-01T00:00:00Z'
    }
  }
]

export const mockCurrentUser: User | null = null
