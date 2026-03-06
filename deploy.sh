#!/bin/bash
# 部署脚本 - 一键部署到 Vercel

set -e

echo "🚀 AI Vibe Daily 部署助手"
echo "=========================="
echo ""

# 检查必要工具
if ! command -v git &> /dev/null; then
    echo "❌ 请先安装 git"
    exit 1
fi

# 1. 检查 GitHub 仓库
echo "📦 步骤 1/4: 检查 GitHub 仓库"
if [ ! -d ".git" ]; then
    echo "初始化 Git 仓库..."
    git init
    git add .
    git commit -m "Initial commit"
    echo "✅ Git 仓库初始化完成"
else
    echo "✅ Git 仓库已存在"
fi

# 检查 remote
if ! git remote -v > /dev/null 2>&1 || [ -z "$(git remote -v)" ]; then
    echo ""
    echo "⚠️  请先将代码推送到 GitHub:"
    echo "   1. 在 GitHub 创建新仓库 (不要初始化)"
    echo "   2. 运行: git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git"
    echo "   3. 运行: git branch -M main && git push -u origin main"
    echo ""
    echo "完成后重新运行此脚本"
    exit 1
fi

echo "✅ GitHub 仓库已配置"
echo ""

# 2. 检查 Supabase 配置
echo "🔧 步骤 2/4: 检查 Supabase 配置"
if [ ! -f ".env.local" ]; then
    echo "❌ 请先创建 .env.local 文件"
    echo ""
    echo "请执行以下操作:"
    echo "1. 访问 https://supabase.com 创建项目"
    echo "2. 在 SQL Editor 执行 supabase/schema.sql"
    echo "3. 复制 .env.local.example 为 .env.local"
    echo "4. 填入你的 Supabase 配置"
    echo ""
    exit 1
fi

echo "✅ 环境变量文件存在"
echo ""

# 3. 构建测试
echo "🏗️  步骤 3/4: 本地构建测试"
npm install
npm run build
if [ $? -eq 0 ]; then
    echo "✅ 构建成功"
else
    echo "❌ 构建失败，请检查错误"
    exit 1
fi
echo ""

# 4. 部署指南
echo "🌐 步骤 4/4: Vercel 部署"
echo ""
echo "现在请按以下步骤完成部署:"
echo ""
echo "1. 访问 https://vercel.com/new"
echo "2. 导入你的 GitHub 仓库"
echo "3. 在环境变量中添加以下配置:"
echo ""
grep -E "^(NEXT_PUBLIC|SUPABASE)" .env.local | while read line; do
    echo "   $line"
done
echo ""
echo "4. 点击 Deploy"
echo ""
echo "部署完成后，Vercel 会给你一个域名，比如:"
echo "https://ai-vibe-daily-xxxxx.vercel.app"
echo ""
echo "✨ 部署指南完成!"
