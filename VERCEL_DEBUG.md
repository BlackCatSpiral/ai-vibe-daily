# Vercel 构建设置说明

## 问题：动态路由返回 404

## 解决方案：

### 1. 登录 Vercel Dashboard
https://vercel.com/dashboard

### 2. 找到项目 "ai-vibe-daily"

### 3. 进入 Settings → General
确认以下设置：
- **Framework Preset**: Next.js
- **Build Command**: `next build`
- **Output Directory**: (留空)
- **Install Command**: `npm install`

### 4. 进入 Settings → Functions
- **Function Region**: 选择离你最近的区域
- **Node.js Version**: 18.x 或 20.x

### 5. 手动重新部署
- 进入 Deployments
- 找到最新部署
- 点击 "Redeploy" 按钮
- 勾选 "Use existing Build Cache" (可选)

### 6. 检查 Functions 日志
部署完成后：
- 进入 Functions 标签
- 点击个人主页路径
- 查看调用日志

### 7. 检查环境变量
确保以下变量已设置：
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY  
- SUPABASE_SERVICE_ROLE_KEY

## 如果还是 404：

尝试以下 URL 模式：
1. https://ai-vibe-daily.blackcatspiral.com/profile/test
2. https://ai-vibe-daily.blackcatspiral.com/profile/%E9%BB%91%E7%8C%AB
3. https://ai-vibe-daily.vercel.app/profile/%E9%BB%91%E7%8C%AB

## 诊断命令

```bash
# 本地测试
cd ai-vibe-daily-app
npm run build
npm start

# 然后访问
# http://localhost:3000/profile/test
```
