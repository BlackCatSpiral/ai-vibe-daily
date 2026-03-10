# GitHub Actions 配置指南

## 概述

本工作流替代原有的 Cron 任务，提供更稳定的早报生成和网站监控。

## 工作流说明

### 1. daily-news.yml - 每日早报生成
- **触发时间**: 每天早上 7:30 (UTC+8)
- **功能**:
  - 自动生成 3-5 条 AI Vibe Coding 新闻
  - 使用本地图片池自动配图
  - 插入 Supabase 数据库
  - 自动提交新图片到 GitHub
  - 失败时发送飞书通知

### 2. health-check.yml - 网站健康检查
- **触发时间**: 每6小时检查一次
- **功能**:
  - 检查网站是否可访问 (HTTP 200)
  - 检查当天早报是否存在
  - 每天上午发送健康报告
  - 异常时立即发送飞书通知

## 配置步骤

### 1. 设置 GitHub Secrets

进入仓库 Settings → Secrets and variables → Actions，添加以下 Secrets：

| Secret Name | 说明 | 示例 |
|------------|------|------|
| `SUPABASE_URL` | Supabase 项目 URL | `https://xxxxx.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Supabase Service Role Key | `eyJhbG...` |
| `FEISHU_WEBHOOK` | 飞书机器人 Webhook URL | `https://open.feishu.cn/...` |

### 2. 准备本地图片池

确保 `public/images/news/` 目录下有足够多的图片（建议 10+ 张）：

```
public/images/news/
├── cursor-auto.jpg
├── claude-tips.jpg
├── claude-voice.jpg
├── claude-outage.jpg
├── cursor-revenue.jpg
├── general-1.jpg
├── general-2.jpg
└── ... (更多图片)
```

### 3. 测试工作流

可以手动触发工作流测试：

1. 进入仓库 Actions 页面
2. 选择 "AI Vibe Coding 早报 - 每日生成"
3. 点击 "Run workflow"

## 与旧 Cron 方案对比

| 特性 | GitHub Actions | OpenClaw Cron |
|------|---------------|---------------|
| 可靠性 | ⭐⭐⭐⭐⭐ (GitHub 托管) | ⭐⭐⭐ (依赖本地环境) |
| 可观测性 | ⭐⭐⭐⭐⭐ (完整日志) | ⭐⭐⭐ |
| 失败重试 | ⭐⭐⭐⭐ (自动重试) | ⭐⭐ |
| 通知机制 | ⭐⭐⭐⭐⭐ (飞书通知) | ⭐⭐⭐⭐ |
| 维护成本 | ⭐⭐⭐ (需配置 Secrets) | ⭐⭐⭐⭐ |

## 故障排查

### 早报生成失败

1. 检查 Actions 日志
2. 确认 Secrets 配置正确
3. 检查 Supabase 连接状态

### 图片不显示

1. 确认图片已提交到 GitHub
2. 检查 Vercel 部署状态
3. 检查图片路径是否正确

## 未来扩展

- [ ] 集成 RSS 自动抓取真实新闻
- [ ] 添加更多图片源
- [ ] 支持多语言新闻
- [ ] 添加新闻热度排序
