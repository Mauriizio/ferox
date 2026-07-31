alter table public.comments
  add column if not exists media_url text null,
  add column if not exists media_type text null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'comments_media_type_check'
      and conrelid = 'public.comments'::regclass
  ) then
    alter table public.comments
      add constraint comments_media_type_check
      check (media_type is null or media_type in ('image', 'video'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'comments_media_pair_check'
      and conrelid = 'public.comments'::regclass
  ) then
    alter table public.comments
      add constraint comments_media_pair_check
      check ((media_url is null) = (media_type is null));
  end if;
end $$;

-- Allow authenticated users to upload review media only inside their own folder.
alter policy "Users can upload own media"
  on storage.objects
  with check (
    bucket_id = 'media'
    and (storage.foldername(name))[1] in ('avatars', 'dogs', 'comments')
    and (storage.foldername(name))[2] = auth.uid()::text
  );

update storage.buckets
set
  file_size_limit = 20 * 1024 * 1024,
  allowed_mime_types = array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/quicktime',
    'video/webm'
  ]::text[]
where id = 'media';
