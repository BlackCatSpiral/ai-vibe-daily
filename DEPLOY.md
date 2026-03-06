# 部署指南

## 1. Supabase 设置

### 创建项目
1. 访问 https://supabase.com 并注册/登录
2. 点击 "New Project"
3. 填写项目名称和密码
4. 选择区域（推荐选择离你最近的）
5. 等待项目创建完成（约 1-2 分钟）

### 配置数据库
1. 进入项目 Dashboard
2. 点击左侧 "SQL Editor"
3. 新建一个查询
4. 复制 `supabase/schema.sql` 的全部内容
5. 粘贴并点击 "Run"
6. 数据库表和函数就创建好了

### 获取 API 密钥
1. 点击左侧 "Project Settings" → "API"
2. 复制以下信息：
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` (在 JWT Settings 中) → `SUPABASE_SERVICE_ROLE_KEY`

## 2. Vercel 部署

### 导入项目
1. 访问 https://vercel.com 并登录
2. 点击 "Add New Project"
3. 导入 GitHub 仓库（需要先把代码推送到 GitHub）
4. 或者选择 "Import Git Repository"

### 配置环境变量
在 Vercel 项目设置中，添加以下环境变量：

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 部署
1. 点击 "Deploy"
2. 等待构建完成（约 1-2 分钟）
3. 获得你的专属域名，如 `https://ai-vibe-daily-xxxxx.vercel.app`

## 3. 本地开发（可选）

```bash
# 克隆项目
cd ai-vibe-daily-app

# 安装依赖
npm install

# 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local 填入你的 Supabase 配置

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## 4. 导入现有数据

```bash
# 设置环境变量后运行
npm run seed
```

## 5. 自定义域名（可选）

1. 在 Vercel 项目设置中找到 "Domains"
2. 添加你的域名
3. 按提示配置 DNS 记录
4. 等待 SSL 证书自动配置

## 注意事项

1. **免费额度**：
   - Supabase 免费版：500MB 数据库，2GB 带宽
   - Vercel 免费版：100GB 带宽，无限制项目

2. **安全提醒**：
   - `SUPABASE_SERVICE_ROLE_KEY` 是管理员密钥，只在服务器端使用
   - 不要将其暴露给客户端

3. **数据库自动备份**：
   - Supabase 免费版每天自动备份

## 下一步

部署完成后，你可以：
- 修改 `src/app/page.tsx` 自定义首页样式
- 在 `tailwind.config.ts` 中修改主题颜色
- 添加更多功能：分享、收藏、邮件订阅等
