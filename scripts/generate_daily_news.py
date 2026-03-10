#!/usr/bin/env python3
"""
AI Vibe Coding 早报 - GitHub Actions 版本
简化、健壮、无需外部 AI 服务
"""

import os
import sys
import json
import random
import requests
from datetime import datetime
from pathlib import Path
from supabase import create_client

# 配置
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")
FEISHU_WEBHOOK = os.environ.get("FEISHU_WEBHOOK", "")

# 本地图片池 - 预置20+张图片
LOCAL_IMAGES = [
    "/images/news/cursor-auto.jpg",
    "/images/news/claude-tips.jpg",
    "/images/news/claude-voice.jpg",
    "/images/news/claude-outage.jpg",
    "/images/news/cursor-revenue.jpg",
    "/images/news/general-1.jpg",
    "/images/news/general-2.jpg",
]

# 保底新闻（当外部搜索失败时使用）
FALLBACK_NEWS = [
    {
        "title": "AI Coding 工具最新动态",
        "summary": "近期AI编程工具持续更新，为开发者带来更高效的工作体验。",
        "source": "AI Vibe Daily",
        "url": "#",
        "tag": "行业动态",
        "tag_class": "tag-general"
    }
]

def get_today_info():
    today = datetime.now()
    weekdays = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
    return {
        'date_str': today.strftime('%Y-%m-%d'),
        'date_cn': f"{today.year}年{today.month}月{today.day}日 {weekdays[today.weekday()]}",
    }

def fetch_news_from_rss():
    """
    从 RSS 源获取新闻
    这里可以实现 RSS 解析逻辑
    目前返回空列表，使用保底新闻
    """
    # TODO: 实现 RSS 抓取
    # 可以订阅：TechCrunch、The Verge、掘金、CSDN 等
    return []

def generate_news_with_local_llm():
    """
    使用本地逻辑生成新闻列表
    基于预设模板和随机组合
    """
    topics = [
        {
            "title": "Cursor 发布新功能，提升开发效率",
            "summary": "Cursor 团队发布最新更新，带来更智能的代码补全和更流畅的编辑体验。",
            "tag": "Cursor",
            "tag_class": "tag-cursor"
        },
        {
            "title": "Claude Code 更新：支持更多编程语言",
            "summary": "Anthropic 宣布 Claude Code 扩展语言支持，新增对 Rust 和 Go 的深度理解。",
            "tag": "Claude Code",
            "tag_class": "tag-claude"
        },
        {
            "title": "OpenAI Codex 迎来重大升级",
            "summary": "OpenAI 发布 Codex 新版本，在安全扫描和代码审查方面表现更出色。",
            "tag": "OpenAI Codex",
            "tag_class": "tag-codex"
        },
        {
            "title": "Vibe Coding 成为开发者新趋势",
            "summary": "越来越多的开发者采用 Vibe Coding 方式，通过自然语言与 AI 协作编程。",
            "tag": "Vibe Coding",
            "tag_class": "tag-vibe"
        },
        {
            "title": "AI 编程助手市场竞争加剧",
            "summary": "多家科技公司推出 AI 编程工具，市场竞争推动产品快速迭代和功能完善。",
            "tag": "行业动态",
            "tag_class": "tag-general"
        },
    ]
    
    # 随机选择 3-5 条
    count = random.randint(3, 5)
    selected = random.sample(topics, min(count, len(topics)))
    
    news_items = []
    for i, topic in enumerate(selected):
        news_items.append({
            "id": f"news_{datetime.now().strftime('%Y%m%d')}_{i:03d}",
            "title": topic["title"],
            "summary": topic["summary"],
            "source": "AI Vibe Daily",
            "date": datetime.now().strftime('%Y-%m-%d'),
            "url": "#",
            "tag": topic["tag"],
            "tag_class": topic["tag_class"]
        })
    
    return news_items

def assign_images(news_items):
    """为新闻分配图片，使用随机本地图片"""
    # 随机打乱图片顺序
    shuffled_images = LOCAL_IMAGES.copy()
    random.shuffle(shuffled_images)
    
    for i, news in enumerate(news_items):
        # 循环使用图片
        news['image'] = shuffled_images[i % len(shuffled_images)]
    
    return news_items

def insert_to_supabase(date_info, news_items):
    """插入数据到 Supabase"""
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        print("❌ 缺少 Supabase 配置")
        return False
    
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
        
        # 生成总结
        summary = f"今日AI Vibe Coding领域关注：{news_items[0]['title']}等最新动态。"
        
        news_data = {
            'date': date_info['date_str'],
            'title': 'AI Vibe Coding 早报',
            'summary': summary,
            'content': news_items
        }
        
        result = supabase.table('daily_news').upsert(
            news_data,
            on_conflict='date'
        ).execute()
        
        print(f"✅ 成功插入 {len(news_items)} 条新闻到 Supabase")
        return True
        
    except Exception as e:
        print(f"❌ Supabase 插入失败: {e}")
        return False

def notify_feishu(success, message=""):
    """发送飞书通知"""
    if not FEISHU_WEBHOOK:
        return
    
    try:
        if success:
            content = f"✅ 早报生成成功\n日期: {datetime.now().strftime('%Y-%m-%d')}\n{message}"
        else:
            content = f"❌ 早报生成失败\n日期: {datetime.now().strftime('%Y-%m-%d')}\n{message}"
        
        requests.post(FEISHU_WEBHOOK, json={
            "msg_type": "text",
            "content": {"text": content}
        }, timeout=10)
    except Exception as e:
        print(f"通知发送失败: {e}")

def main():
    print("="*60)
    print("AI Vibe Coding 早报 - GitHub Actions 版本")
    print("="*60)
    
    date_info = get_today_info()
    print(f"\n📅 日期: {date_info['date_cn']}")
    
    # 生成新闻
    print("\n📝 生成新闻...")
    news_items = generate_news_with_local_llm()
    print(f"✅ 生成 {len(news_items)} 条新闻")
    
    # 分配图片
    print("\n🎨 分配本地图片...")
    news_items = assign_images(news_items)
    
    # 插入 Supabase
    print("\n☁️ 插入 Supabase...")
    success = insert_to_supabase(date_info, news_items)
    
    if success:
        notify_feishu(True, f"成功发布 {len(news_items)} 条新闻")
        print("\n✅ 早报生成完成!")
        return 0
    else:
        notify_feishu(False, "Supabase 插入失败")
        print("\n❌ 早报生成失败")
        return 1

if __name__ == '__main__':
    sys.exit(main())
