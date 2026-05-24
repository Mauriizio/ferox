-- Allow public read for community reviews metadata.
-- This is required so unauthenticated visitors can see reviewer name/avatar.

alter table public.profiles enable row level security;
alter table public.comments enable row level security;
alter table public.comment_likes enable row level security;

drop policy if exists "profiles are readable by authenticated users" on public.profiles;
drop policy if exists "profiles are readable by everyone" on public.profiles;
create policy "profiles are readable by everyone"
  on public.profiles for select
  using (true);

drop policy if exists "comments are readable by authenticated users" on public.comments;
drop policy if exists "comments are readable by everyone" on public.comments;
create policy "comments are readable by everyone"
  on public.comments for select
  using (true);

drop policy if exists "comment likes are readable by authenticated users" on public.comment_likes;
drop policy if exists "comment likes are readable by everyone" on public.comment_likes;
create policy "comment likes are readable by everyone"
  on public.comment_likes for select
  using (true);
