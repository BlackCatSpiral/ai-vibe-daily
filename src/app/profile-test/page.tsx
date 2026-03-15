export const dynamic = 'force-dynamic'

export default function TestProfilePage() {
  return (
    <main className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-card-bg border border-white/10 rounded-2xl p-12 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">测试页面</h1>
          <p className="text-gray-300">如果看到这个，说明路由是正常的</p>
        </div>
      </div>
    </main>
  )
}
