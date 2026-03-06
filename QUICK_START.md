# 快速部署指南

## 🚀 10分钟完成部署

### 第一步：创建 Supabase 数据库（3分钟）

1. 访问 https://supabase.com
2. 点击 "New Project"
3. 输入项目名称：`ai-vibe-daily`
4. 设置数据库密码（记住它）
5. 等待创建完成（约1分钟）

**配置数据库：**
1. 进入项目 Dashboard
2. 左侧点击 "SQL Editor"
3. 点击 "New query"
4. 打开 `supabase/schema.sql` 文件，复制全部内容
5. 粘贴到 SQL Editor，点击 "Run"
6. ✅ 数据库创建完成

**获取 API 密钥：**
1. 左侧点击 "Project Settings" → "API"
2. 复制这三个值：
   - `Project URL` 
   - `anon public` API key
   - `service_role` secret (在 JWT Settings 中)

---

### 第二步：推送代码到 GitHub（2分钟）

在你的项目目录运行：

```bash
cd /root/.openclaw/workspace/ai-vibe-daily-app

# 初始化 git（如果没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 推送到 GitHub
# 先在 GitHub 创建新仓库（不要初始化 README）
git remote add origin https://github.com/YOUR_USERNAME/ai-vibe-daily.git
git branch -M main
git push -u origin main
```

---

### 第三步：部署到 Vercel（5分钟）

1. 访问 https://vercel.com
2. 用 GitHub 账号登录
3. 点击 "Add New Project"
4. 选择 `ai-vibe-daily` 仓库
5. 点击 "Import"

**配置环境变量：**
在 Environment Variables 区域添加：

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

6. 点击 "Deploy"
7. 等待 1-2 分钟
8. 🎉 完成！获得你的专属链接

---

## 📝 部署后操作

### 导入现有数据

```bash
# 设置环境变量
export NEXT_PUBLIC_SUPABASE_URL=your-url
export SUPABASE_SERVICE_ROLE_KEY=your-key

# 运行导入脚本
npm run seed
```

### 绑定自定义域名（可选）

1. 在 Vercel 项目设置中找到 "Domains"
2. 添加你的域名
3. 按提示配置 DNS

---

## 🔧 常见问题

**Q: 部署失败？**
- 检查环境变量是否填对
- 确认 Supabase 数据库已创建

**Q: 登录功能不工作？**
- 检查 Supabase Auth 是否开启
- 确认邮件验证设置

**Q: 如何更新内容？**
- 修改代码 → 推送 GitHub → Vercel 自动重新部署

---

## 📊 费用

- **Supabase 免费版**: 500MB 数据库，2GB 带宽
- **Vercel 免费版**: 100GB 带宽，无限项目

对于个人早报网站，免费版完全够用。
