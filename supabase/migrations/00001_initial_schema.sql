-- Playoff Mobile — initial schema (PRD)
-- Run via Supabase CLI: supabase db push

create extension if not exists "uuid-ossp";

create table public.users (
  id uuid primary key default uuid_generate_v4(),
  spotify_id text unique not null,
  display_name text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.user_settings (
  user_id uuid primary key references public.users(id) on delete cascade,
  reduced_motion boolean not null default false,
  low_end_mode boolean not null default false,
  haptics_enabled boolean not null default true
);

create type public.room_status as enum ('open', 'locked', 'closed');
create type public.room_role as enum ('host', 'moderator', 'participant');

create table public.rooms (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  name text not null,
  host_id uuid not null references public.users(id),
  status public.room_status not null default 'open',
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.room_members (
  id uuid primary key default uuid_generate_v4(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role public.room_role not null default 'participant',
  joined_at timestamptz not null default now(),
  unique (room_id, user_id)
);

create table public.room_queue (
  id uuid primary key default uuid_generate_v4(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  track_id text not null,
  track_uri text not null,
  track_name text not null,
  artist_name text not null,
  album_art_url text,
  added_by uuid not null references public.users(id),
  votes int not null default 0,
  position int not null,
  created_at timestamptz not null default now()
);

create table public.room_votes (
  id uuid primary key default uuid_generate_v4(),
  queue_item_id uuid not null references public.room_queue(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (queue_item_id, user_id)
);

create table public.playback_state (
  room_id uuid primary key references public.rooms(id) on delete cascade,
  track_uri text,
  is_playing boolean not null default false,
  position_ms int not null default 0,
  updated_at timestamptz not null default now()
);

create table public.activity_feed (
  id uuid primary key default uuid_generate_v4(),
  room_id uuid references public.rooms(id) on delete cascade,
  user_id uuid references public.users(id) on delete set null,
  event_type text not null,
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- RLS: enable and add policies per role in Phase 3+
