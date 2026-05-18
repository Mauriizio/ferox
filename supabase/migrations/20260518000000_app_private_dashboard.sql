-- FEROX BARF private account/dashboard support.
-- Non destructive: only adds missing columns/constraints/policies needed by the app.

alter table public.profiles
  add column if not exists avatar_url text;

alter table public.dogs
  add column if not exists photo_url text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'dogs_user_id_fkey'
      and conrelid = 'public.dogs'::regclass
  ) then
    alter table public.dogs
      add constraint dogs_user_id_fkey
      foreign key (user_id) references auth.users(id) on delete cascade
      not valid;
  end if;
end $$;

alter table public.dogs validate constraint dogs_user_id_fkey;

alter table public.food_calculations
  add column if not exists user_id uuid references auth.users(id) on delete cascade,
  add column if not exists dog_id uuid references public.dogs(id) on delete cascade,
  add column if not exists gramos_diarios integer,
  add column if not exists gramos_mensuales integer,
  add column if not exists peso numeric,
  add column if not exists edad text,
  add column if not exists actividad text,
  add column if not exists estado_fisico text;

alter table public.comments
  add column if not exists user_id uuid references auth.users(id) on delete cascade,
  add column if not exists body text;

alter table public.comment_likes
  add column if not exists user_id uuid references auth.users(id) on delete cascade,
  add column if not exists comment_id uuid references public.comments(id) on delete cascade;

create unique index if not exists comment_likes_user_comment_unique
  on public.comment_likes (user_id, comment_id);

alter table public.profiles enable row level security;
alter table public.dogs enable row level security;
alter table public.food_calculations enable row level security;
alter table public.comments enable row level security;
alter table public.comment_likes enable row level security;

drop policy if exists "profiles are readable by owner" on public.profiles;
create policy "profiles are readable by owner"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles are writable by owner" on public.profiles;
create policy "profiles are writable by owner"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profiles are updateable by owner" on public.profiles;
create policy "profiles are updateable by owner"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "dogs are private to owner" on public.dogs;
create policy "dogs are private to owner"
  on public.dogs for select
  using (auth.uid() = user_id);

drop policy if exists "dogs are insertable by owner" on public.dogs;
create policy "dogs are insertable by owner"
  on public.dogs for insert
  with check (auth.uid() = user_id);

drop policy if exists "dogs are updateable by owner" on public.dogs;
create policy "dogs are updateable by owner"
  on public.dogs for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "dogs are deleteable by owner" on public.dogs;
create policy "dogs are deleteable by owner"
  on public.dogs for delete
  using (auth.uid() = user_id);

drop policy if exists "food calculations are private to owner" on public.food_calculations;
create policy "food calculations are private to owner"
  on public.food_calculations for select
  using (auth.uid() = user_id);

drop policy if exists "food calculations are insertable by owner" on public.food_calculations;
create policy "food calculations are insertable by owner"
  on public.food_calculations for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.dogs
      where dogs.id = food_calculations.dog_id
        and dogs.user_id = auth.uid()
    )
  );

drop policy if exists "comments are readable by authenticated users" on public.comments;
create policy "comments are readable by authenticated users"
  on public.comments for select
  using (auth.role() = 'authenticated');

drop policy if exists "comments are insertable by owner" on public.comments;
create policy "comments are insertable by owner"
  on public.comments for insert
  with check (auth.uid() = user_id);

drop policy if exists "comments are updateable by owner" on public.comments;
create policy "comments are updateable by owner"
  on public.comments for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "comment likes are readable by authenticated users" on public.comment_likes;
create policy "comment likes are readable by authenticated users"
  on public.comment_likes for select
  using (auth.role() = 'authenticated');

drop policy if exists "comment likes are insertable by owner" on public.comment_likes;
create policy "comment likes are insertable by owner"
  on public.comment_likes for insert
  with check (auth.uid() = user_id);

drop policy if exists "comment likes are deleteable by owner" on public.comment_likes;
create policy "comment likes are deleteable by owner"
  on public.comment_likes for delete
  using (auth.uid() = user_id);
