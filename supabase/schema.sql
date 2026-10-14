create extension if not exists pgcrypto;

create table if not exists public.mixtapes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[A-Za-z0-9_-]{8,}$'),
  cover_path text not null check (cover_path like 'builtin:%' or cover_path ~ '^[A-Za-z0-9_-]+\.(jpg|png|webp)$'),
  letter_recipient text check (letter_recipient is null or char_length(letter_recipient) <= 80),
  letter_body text check (letter_body is null or char_length(letter_body) <= 2000),
  letter_sender text check (letter_sender is null or char_length(letter_sender) <= 80),
  status text not null default 'published' check (status in ('published', 'hidden')),
  created_at timestamptz not null default now()
);

create table if not exists public.songs (
  id uuid primary key default gen_random_uuid(),
  mixtape_id uuid not null constraint songs_mixtape_id_fkey references public.mixtapes(id) on delete cascade,
  url text not null check (char_length(url) <= 2048),
  provider text not null default 'youtube' check (provider = 'youtube'),
  provider_id text not null check (provider_id ~ '^[A-Za-z0-9_-]{11}$'),
  title text not null check (char_length(title) between 1 and 200),
  position integer not null check (position between 1 and 50),
  created_at timestamptz not null default now(),
  constraint songs_mixtape_position_key unique (mixtape_id, position)
);

create table if not exists public.mixtape_stickers (
  id uuid primary key default gen_random_uuid(),
  mixtape_id uuid not null constraint mixtape_stickers_mixtape_id_fkey references public.mixtapes(id) on delete cascade,
  sticker_id text not null check (sticker_id ~ '^[a-z0-9-]+$'),
  position integer not null check (position between 0 and 5),
  rotation numeric not null default 0 check (rotation between -180 and 180),
  created_at timestamptz not null default now(),
  constraint mixtape_stickers_mixtape_position_key unique (mixtape_id, position)
);

alter table public.mixtape_stickers
  drop constraint if exists mixtape_stickers_position_check;

alter table public.mixtape_stickers
  add constraint mixtape_stickers_position_check check (position between 0 and 5);

create index if not exists songs_mixtape_id_idx on public.songs(mixtape_id, position);
create index if not exists mixtape_stickers_mixtape_id_idx on public.mixtape_stickers(mixtape_id, position);

alter table public.mixtapes enable row level security;
alter table public.songs enable row level security;
alter table public.mixtape_stickers enable row level security;

drop policy if exists "published mixtapes are readable" on public.mixtapes;
create policy "published mixtapes are readable"
  on public.mixtapes for select
  using (status = 'published');

drop policy if exists "published songs are readable" on public.songs;
create policy "published songs are readable"
  on public.songs for select
  using (
    exists (
      select 1
      from public.mixtapes mixtape
      where mixtape.id = songs.mixtape_id
        and mixtape.status = 'published'
    )
  );

drop policy if exists "published stickers are readable" on public.mixtape_stickers;
create policy "published stickers are readable"
  on public.mixtape_stickers for select
  using (
    exists (
      select 1
      from public.mixtapes mixtape
      where mixtape.id = mixtape_stickers.mixtape_id
        and mixtape.status = 'published'
    )
  );

grant select on public.mixtapes, public.songs, public.mixtape_stickers to anon, authenticated;
revoke insert, update, delete on public.mixtapes, public.songs, public.mixtape_stickers from anon, authenticated;

create or replace function public.create_mixtape(payload jsonb)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  p_slug text := payload ->> 'slug';
  p_cover_path text := payload ->> 'coverPath';
  p_letter_recipient text := nullif(payload ->> 'letterRecipient', '');
  p_letter_body text := nullif(payload ->> 'letterBody', '');
  p_letter_sender text := nullif(payload ->> 'letterSender', '');
  song_row jsonb;
  sticker_row jsonb;
  song_position integer;
  sticker_position integer;
  sticker_rotation numeric;
begin
  if p_slug is null or not (p_slug ~ '^[A-Za-z0-9_-]{8,}$') then
    raise exception 'Invalid mixtape slug';
  end if;

  if p_cover_path is null or not (p_cover_path like 'builtin:%' or p_cover_path ~ '^[A-Za-z0-9_-]+\.(jpg|png|webp)$') then
    raise exception 'Invalid cover path';
  end if;

  if p_letter_recipient is not null and char_length(p_letter_recipient) > 80 then
    raise exception 'Letter recipient is too long';
  end if;
  if p_letter_body is not null and char_length(p_letter_body) > 2000 then
    raise exception 'Letter body is too long';
  end if;
  if p_letter_sender is not null and char_length(p_letter_sender) > 80 then
    raise exception 'Letter sender is too long';
  end if;

  if jsonb_typeof(payload -> 'songs') is distinct from 'array' then
    raise exception 'Songs are required';
  end if;
  if jsonb_array_length(payload -> 'songs') not between 1 and 50 then
    raise exception 'A mixtape needs between 1 and 50 songs';
  end if;

  if jsonb_typeof(payload -> 'stickers') is distinct from 'array' then
    raise exception 'Stickers must be an array';
  end if;
  if jsonb_array_length(payload -> 'stickers') > 6 then
    raise exception 'A mixtape can have at most 6 stickers';
  end if;

  insert into public.mixtapes (
    slug,
    cover_path,
    letter_recipient,
    letter_body,
    letter_sender,
    status
  ) values (
    p_slug,
    p_cover_path,
    p_letter_recipient,
    p_letter_body,
    p_letter_sender,
    'published'
  );

  for song_row in select value from jsonb_array_elements(payload -> 'songs') loop
    song_position := nullif(song_row ->> 'position', '')::integer;
    if song_position is null
      or song_position not between 1 and 50
      or coalesce(song_row ->> 'provider', '') <> 'youtube'
      or coalesce(song_row ->> 'providerId', '') !~ '^[A-Za-z0-9_-]{11}$'
      or coalesce(song_row ->> 'title', '') = ''
      or char_length(song_row ->> 'title') > 200
      or coalesce(song_row ->> 'url', '') = ''
      or char_length(song_row ->> 'url') > 2048 then
      raise exception 'Invalid song data';
    end if;

    insert into public.songs (
      mixtape_id,
      url,
      provider,
      provider_id,
      title,
      position
    ) values (
      (select id from public.mixtapes where slug = p_slug),
      song_row ->> 'url',
      'youtube',
      song_row ->> 'providerId',
      song_row ->> 'title',
      song_position
    );
  end loop;

  for sticker_row in select value from jsonb_array_elements(payload -> 'stickers') loop
    sticker_position := nullif(sticker_row ->> 'position', '')::integer;
    sticker_rotation := nullif(sticker_row ->> 'rotation', '')::numeric;
    if sticker_position is null
      or sticker_position not between 0 and 5
      or sticker_rotation is null
      or sticker_rotation not between -180 and 180
      or coalesce(sticker_row ->> 'stickerId', '') !~ '^[a-z0-9-]+$' then
      raise exception 'Invalid sticker data';
    end if;

    insert into public.mixtape_stickers (
      mixtape_id,
      sticker_id,
      position,
      rotation
    ) values (
      (select id from public.mixtapes where slug = p_slug),
      sticker_row ->> 'stickerId',
      sticker_position,
      sticker_rotation
    );
  end loop;

  return p_slug;
exception
  when unique_violation then
    raise exception 'Mixtape slug already exists';
end;
$$;

revoke all on function public.create_mixtape(jsonb) from public;
grant execute on function public.create_mixtape(jsonb) to service_role;
