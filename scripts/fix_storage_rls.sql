-- Storage RLS 修复：允许已认证用户上传头像

-- 1. 启用 avatars bucket 的 RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 2. 允许已认证用户查看头像
CREATE POLICY "Avatar images are publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- 3. 允许已认证用户上传头像（只能上传自己的文件）
CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- 或者更宽松的策略（允许上传任意文件名）
CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated'
  );

-- 4. 允许用户删除自己的头像
CREATE POLICY "Users can delete own avatars"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.uid() = owner
  );
