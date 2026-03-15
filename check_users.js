const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://bavlatfnyluqybmorpzs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhdmxhdGZueWx1cXlibW9ycHpzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjc4MTA1NCwiZXhwIjoyMDg4MzU3MDU0fQ.x_lStRC2jkVrnzV4VzdhaKLP98ED2fWxkH6pD_hip8o'
)

async function checkUsers() {
  // 精确查询
  const { data: exact, error: err1 } = await supabase
    .from('profiles')
    .select('id, username, bio, created_at')
    .eq('username', '黑猫')
    .maybeSingle()
  
  console.log('Exact match for "黑猫":', exact)
  
  // 获取所有用户名的十六进制表示
  const { data: all, error: err2 } = await supabase
    .from('profiles')
    .select('username')
  
  console.log('\nAll usernames with hex:')
  all.forEach(u => {
    const hex = Buffer.from(u.username).toString('hex')
    console.log(`  "${u.username}" = ${hex}`)
    console.log(`  length: ${u.username.length}, bytes: ${Buffer.byteLength(u.username)}`)
  })
}

checkUsers()
