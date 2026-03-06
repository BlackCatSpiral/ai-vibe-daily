#!/usr/bin/env node
/**
 * 数据导入脚本
 * 将现有的 daily_news_data.json 导入到 Supabase
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('错误: 请设置 NEXT_PUBLIC_SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY 环境变量')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedData() {
  // 读取现有数据
  const dataPath = path.join(__dirname, '../daily_news_data.json')
  
  if (!fs.existsSync(dataPath)) {
    console.log('未找到 daily_news_data.json，创建示例数据...')
    
    // 创建示例数据
    const sampleData = {
      date: new Date().toISOString().split('T')[0],
      title: 'AI Vibe Coding 早报',
      summary: '今日AI Vibe Coding领域关注：Claude Code 2025年3月全量开放、Vibe Coding成为2025年编程新范式、OpenAI Codex App正式上线等最新动态。',
      content: [
        {
          title: 'Claude Code 2025年3月全量开放',
          summary: 'Anthropic宣布Claude Code正式全量开放，所有开发者都可以使用这一AI编程助手。新版本支持更复杂的代码重构任务，准确率提升40%。',
          source: 'Anthropic Blog',
          date: new Date().toISOString().split('T')[0],
          url: 'https://www.anthropic.com',
          tag: '重大更新',
          tag_class: 'update'
        },
        {
          title: 'Vibe Coding成为2025年编程新范式',
          summary: '随着AI辅助编程工具的普及，Vibe Coding正在成为一种新的编程范式。开发者更多地专注于创意和架构，而非具体实现细节。',
          source: 'TechCrunch',
          date: new Date().toISOString().split('T')[0],
          url: 'https://techcrunch.com',
          tag: '行业趋势',
          tag_class: 'trend'
        },
        {
          title: 'OpenAI Codex App月活突破100万',
          summary: 'OpenAI宣布Codex App正式上线后月活用户已突破100万。该应用支持iOS和Android平台，让开发者随时随地进行AI辅助编程。',
          source: 'OpenAI Blog',
          date: new Date().toISOString().split('T')[0],
          url: 'https://openai.com',
          tag: '产品发布',
          tag_class: 'update'
        },
        {
          title: 'AI生成代码质量引发讨论',
          summary: '最新研究显示，AI生成的代码在安全性方面仍需人工审核。专家建议建立AI代码审查流程，确保生产环境代码质量。',
          source: 'InfoQ',
          date: new Date().toISOString().split('T')[0],
          url: 'https://www.infoq.com',
          tag: '安全提醒',
          tag_class: 'security'
        },
        {
          title: 'GitHub Copilot新增团队协作功能',
          summary: 'GitHub宣布Copilot新增团队共享代码库功能，支持团队成员共享AI编程配置和代码片段，提升团队协作效率。',
          source: 'GitHub Blog',
          date: new Date().toISOString().split('T')[0],
          url: 'https://github.blog',
          tag: '功能更新',
          tag_class: 'update'
        }
      ]
    }
    
    await insertNews(sampleData)
    console.log('✅ 示例数据导入成功')
    return
  }
  
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
  
  // 转换数据格式
  const newsItem = {
    date: data.date || new Date().toISOString().split('T')[0],
    title: data.title || 'AI Vibe Coding 早报',
    summary: data.summary || '今日AI Vibe Coding领域最新动态',
    content: data.content || data.news || []
  }
  
  await insertNews(newsItem)
  console.log('✅ 数据导入成功')
}

async function insertNews(news) {
  const { data, error } = await supabase
    .from('daily_news')
    .upsert(news, { onConflict: 'date' })
    .select()
  
  if (error) {
    console.error('导入失败:', error)
    throw error
  }
  
  console.log('插入/更新记录:', data?.length || 0)
}

seedData().catch(console.error)
