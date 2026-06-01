
DROP POLICY IF EXISTS "Avatars are publicly viewable" ON storage.objects;
-- Public bucket already serves files via public URL without needing SELECT on storage.objects.
-- Only allow owners to list/inspect their own avatar objects.
CREATE POLICY "Users view own avatar object"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
