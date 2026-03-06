# AI Vibe Daily - 全栈早报应用

基于 Next.js 14 + Supabase 的全栈应用，支持用户注册、登录、评论和点赞功能。

## 技术栈

- **框架**: Next.js 14 (App Router) + React + TypeScript
- **样式**: Tailwind CSS
- **数据库**: Supabase (PostgreSQL + Auth)
- **部署**: Vercel

## 本地开发

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
```bash
cp .env.local.example .env.local
```

编辑 `.env.local`，填入你的 Supabase 配置：
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. 本地构建测试
```bash
npm run build
```

如果构建成功，说明代码没有问题。

### 4. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000

## Supabase 设置

### 1. 创建项目
1. 访问 https://supabase.com
2. 点击 "New Project"
3. 设置项目名称和密码
4. 等待创建完成

### 2. 执行数据库脚本
1. 进入项目 Dashboard
2. 点击左侧 "SQL Editor"
3. 新建查询
4. 复制 `supabase/schema.sql` 全部内容
5. 粘贴并点击 "Run"

### 3. 获取 API 密钥
1. 点击左侧 "Project Settings" → "API"
2. 复制：
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` secret → `SUPABASE_SERVICE_ROLE_KEY`

## 部署到 Vercel

### 方法一：Git 推送

1. 创建 GitHub 仓库
2. 推送代码：
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ai-vibe-daily.git
git push -u origin main
```

3. 访问 https://vercel.com/new
4. 导入 GitHub 仓库
5. 配置环境变量（同上）
6. 点击 Deploy

### 方法二：Vercel CLI

```bash
npm i -g vercel
vercel
```

按提示操作即可。

## 导入现有数据

```bash
# 设置环境变量
export NEXT_PUBLIC_SUPABASE_URL=your-url
export SUPABASE_SERVICE_ROLE_KEY=your-key

# 运行导入脚本
npm run seed
```

## 项目结构

```
ai-vibe-daily-app/
├── src/
│   ├── app/              # Next.js 页面
│   ├── components/       # React 组件
│   ├── lib/             # 工具库和类型
│   ├── types/           # TypeScript 类型
│   └── utils/           # 工具函数
├── supabase/
│   └── schema.sql       # 数据库结构
├── scripts/
│   └── seed.js          # 数据导入脚本
└── .env.local.example   # 环境变量模板
```

## 功能特性

- ✅ 用户注册/登录（邮箱+密码）
- ✅ 每日早报展示
- ✅ 文章点赞
- ✅ 评论系统
- ✅ 历史归档
- ✅ 响应式设计
- ✅ 赛博朋克风格UI

## 故障排查

### 构建失败
1. 检查 `npm install` 是否成功
2. 检查 `.env.local` 是否存在且配置正确
3. 查看错误日志，修复 TypeScript 错误

### 数据库连接失败
1. 确认 Supabase 项目已创建
2. 确认 schema.sql 已执行
3. 检查 API 密钥是否正确

### 登录/注册不工作
1. 检查 Supabase Auth 设置
2. 确认 profiles 表已创建
3. 检查触发器是否正常工作

## 许可证

MIT
// force redeploy Fri Mar  6 08:20:21 PM CST 2026
