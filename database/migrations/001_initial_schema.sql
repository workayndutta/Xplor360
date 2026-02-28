-- =============================================================================
-- Xplor360 — Initial Database Schema
-- Run this migration in your Supabase SQL editor (Dashboard → SQL Editor)
-- =============================================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Enable pg_trgm for fuzzy search on destinations
create extension if not exists "pg_trgm";


-- =============================================================================
-- USERS & PERSONAS
-- =============================================================================

-- Public user profiles (extends auth.users via foreign key)
create table public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  display_name    text,
  avatar_url      text,
  bio             text,
  preferred_lang  text not null default 'en',   -- 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'mr' | 'bn'
  subscription    text not null default 'free', -- 'free' | 'creator' | 'pro'
  subscription_ends_at timestamptz,
  razorpay_customer_id text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- 7-dimension persona model (one row per user, upserted as they interact)
create table public.persona_profiles (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null unique references public.profiles(id) on delete cascade,

  -- Dimension 1: Travel DNA
  fitness_level       text default 'moderate',  -- 'low' | 'moderate' | 'high' | 'extreme'
  risk_appetite       text default 'medium',    -- 'low' | 'medium' | 'high'
  preferred_terrain   text[] default '{}',      -- ['mountains','beaches','plains','deserts']
  accommodation_style text default 'budget',    -- 'budget' | 'mid' | 'premium' | 'luxury'
  solo_vs_group       text default 'group',     -- 'solo' | 'couple' | 'family' | 'group'
  domestic_vs_intl    text default 'domestic',  -- 'domestic' | 'international' | 'both'

  -- Dimension 2: Content Creator Profile
  publishing_frequency text default 'occasional', -- 'daily' | 'weekly' | 'occasional' | 'never'
  preferred_platform   text[] default '{}',        -- ['instagram','youtube','snapchat']
  content_style        text default 'casual',      -- 'raw' | 'casual' | 'curated' | 'professional'
  editing_skill        text default 'beginner',    -- 'beginner' | 'intermediate' | 'advanced'
  follower_count       integer default 0,

  -- Dimension 3: Spiritual / Cultural Orientation
  religious_affiliation text default 'none',
  festival_interest     boolean default false,
  dietary_preference    text default 'non-veg',   -- 'veg' | 'non-veg' | 'vegan' | 'jain'

  -- Dimension 4: Financial Profile
  per_trip_budget_min integer,    -- INR
  per_trip_budget_max integer,    -- INR
  payment_preference  text default 'upi',  -- 'upi' | 'card' | 'netbanking'
  installment_ok      boolean default false,

  -- Dimension 5: Social Graph (computed, not user-entered)
  frequent_companions uuid[] default '{}',  -- user IDs of common travel companions

  -- Dimension 6: Temporal Patterns
  trips_per_year      integer default 2,
  preferred_seasons   text[] default '{}',         -- ['winter','summer','monsoon','spring']
  avg_trip_length_days integer default 4,
  booking_lead_days   integer default 21,           -- how far ahead they typically book

  -- Dimension 7: Content Performance (updated by AnalyticsAgent)
  best_content_types  text[] default '{}',          -- ['reel','carousel','blog']
  peak_post_times     jsonb default '{}',            -- {"instagram": "19:00", "youtube": "17:00"}
  top_hashtags        text[] default '{}',

  archetype_ids       uuid[] default '{}',           -- matched persona archetypes
  updated_at          timestamptz not null default now()
);

-- Pre-built persona archetypes (20 seeded records — see seed/persona_archetypes.sql)
create table public.persona_archetypes (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null unique,  -- e.g. 'Memory Maker — Budget'
  persona_type    text not null,         -- 'memory_maker' | 'globe_trotter' | 'novice' | 'pilgrim' | 'expedition' | 'family'
  description     text,
  traits          jsonb not null default '{}',
  sample_destinations text[] default '{}',
  created_at      timestamptz not null default now()
);


-- =============================================================================
-- DESTINATIONS
-- =============================================================================

create table public.destinations (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  state           text,
  country         text not null default 'India',
  lat             double precision,
  lng             double precision,
  description     text,
  tags            text[] default '{}',     -- ['adventure','beach','pilgrimage','wildlife']
  best_months     int[] default '{}',      -- 1–12 representing months
  avg_budget_low  integer,                 -- INR per person per day
  avg_budget_high integer,
  difficulty      text default 'easy',     -- 'easy' | 'moderate' | 'hard' | 'extreme'
  permits_required boolean default false,
  permit_info     text,
  created_at      timestamptz not null default now()
);

-- Shot guides (ContentPilot: what to film and where)
create table public.shot_guides (
  id              uuid primary key default uuid_generate_v4(),
  destination_id  uuid not null references public.destinations(id) on delete cascade,
  title           text not null,
  description     text,
  lat             double precision,
  lng             double precision,
  best_time       text,     -- 'golden_hour' | 'blue_hour' | 'midday' | 'night'
  framing_tip     text,
  shot_type       text,     -- 'wide' | 'medium' | 'close_up' | 'aerial' | 'pov'
  viral_count     integer default 0,   -- how many times this spot went viral (from our archive)
  created_at      timestamptz not null default now()
);


-- =============================================================================
-- TRIPS
-- =============================================================================

create table public.trips (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  title           text not null,
  destination     text not null,
  origin          text,
  start_date      date not null,
  end_date        date not null,
  trip_type       text not null default 'solo',   -- 'solo' | 'couple' | 'family' | 'group' | 'expedition'
  travel_style    text not null default 'leisure',
  status          text not null default 'planning', -- 'planning' | 'booked' | 'active' | 'completed' | 'cancelled'
  num_travelers   integer not null default 1,
  budget_inr      integer,
  notes           text,
  expedition_id   uuid,    -- references expeditions(id) if this trip is an expedition
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- AI-generated day-by-day itinerary (one per trip)
create table public.itineraries (
  id              uuid primary key default uuid_generate_v4(),
  trip_id         uuid not null unique references public.trips(id) on delete cascade,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  summary         text,
  total_estimated_cost_inr integer,
  packing_list    jsonb default '[]',
  key_tips        text[] default '{}',
  best_time_note  text,
  raw_llm_response jsonb,    -- store raw Claude output for debugging / regeneration
  version         integer not null default 1,
  created_at      timestamptz not null default now()
);

-- Individual days within an itinerary
create table public.itinerary_days (
  id              uuid primary key default uuid_generate_v4(),
  itinerary_id    uuid not null references public.itineraries(id) on delete cascade,
  day_number      integer not null,
  date            date,
  title           text not null,
  summary         text,
  transport_for_day text,
  accommodation   text,
  estimated_cost_inr integer,
  weather_note    text,
  constraint unique_day_in_itinerary unique (itinerary_id, day_number)
);

-- Individual activities within a day
create table public.itinerary_activities (
  id              uuid primary key default uuid_generate_v4(),
  day_id          uuid not null references public.itinerary_days(id) on delete cascade,
  time            text,           -- "09:30"
  title           text not null,
  description     text,
  location        text,
  lat             double precision,
  lng             double precision,
  duration_minutes integer,
  cost_inr        integer,
  booking_url     text,
  content_opportunity text,       -- ContentPilot shot suggestion
  sort_order      integer not null default 0
);

-- Individual booking legs (flights, trains, buses, hotels)
create table public.trip_legs (
  id              uuid primary key default uuid_generate_v4(),
  trip_id         uuid not null references public.trips(id) on delete cascade,
  leg_type        text not null,  -- 'flight' | 'train' | 'bus' | 'hotel' | 'cab' | 'ferry'
  provider        text,           -- 'Amadeus' | 'IRCTC' | 'RedBus' | 'Booking.com'
  external_booking_id text,       -- provider's booking reference
  status          text default 'pending', -- 'pending' | 'confirmed' | 'cancelled'
  from_location   text,
  to_location     text,
  departure_at    timestamptz,
  arrival_at      timestamptz,
  amount_inr      integer,
  booking_meta    jsonb default '{}',   -- raw API response for reconciliation
  created_at      timestamptz not null default now()
);

-- Fare alerts for preferred routes
create table public.fare_alerts (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  route_type      text not null,   -- 'flight' | 'train'
  origin          text not null,
  destination     text not null,
  travel_date     date,
  target_price_inr integer not null,
  current_price_inr integer,
  notified        boolean default false,
  active          boolean default true,
  created_at      timestamptz not null default now()
);


-- =============================================================================
-- EXPEDITIONS
-- =============================================================================

create table public.expeditions (
  id              uuid primary key default uuid_generate_v4(),
  title           text not null,
  category        text not null,   -- 'bike' | 'trek' | 'pilgrimage' | 'wildlife' | 'cultural' | 'festival'
  description     text,
  leader_id       uuid references public.profiles(id),
  destination     text not null,
  difficulty      text default 'moderate',
  start_date      date,
  end_date        date,
  max_participants integer,
  current_participants integer default 0,
  price_per_person_inr integer,
  deposit_inr     integer,
  status          text default 'open', -- 'open' | 'full' | 'completed' | 'cancelled'
  route_gpx       text,     -- URL to GPX file in R2
  highlights      text[] default '{}',
  requirements    text[] default '{}',   -- fitness / gear prerequisites
  permits_included boolean default false,
  created_at      timestamptz not null default now()
);

create table public.expedition_participants (
  id              uuid primary key default uuid_generate_v4(),
  expedition_id   uuid not null references public.expeditions(id) on delete cascade,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  status          text default 'pending', -- 'pending' | 'confirmed' | 'cancelled'
  payment_status  text default 'unpaid',  -- 'unpaid' | 'deposit_paid' | 'paid'
  joined_at       timestamptz not null default now(),
  constraint unique_participant unique (expedition_id, user_id)
);


-- =============================================================================
-- MEDIA & CONTENT (ContentPilot)
-- =============================================================================

-- Raw recordings uploaded by users
create table public.media_assets (
  id              uuid primary key default uuid_generate_v4(),
  trip_id         uuid references public.trips(id) on delete set null,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  asset_type      text not null,    -- 'audio' | 'video' | 'photo'
  recording_mode  text,             -- 'quick_impression' | 'day_summary' | 'deep_dive' | 'ambient' | 'reel_mode' | 'vlog_mode'
  storage_url     text not null,    -- R2 object URL
  duration_sec    integer,
  file_size_bytes integer,
  transcript      text,             -- Whisper output
  context_tag     text,             -- user-applied tag: 'food_review' | 'location_impression' | 'tip'
  lat             double precision,
  lng             double precision,
  recorded_at     timestamptz not null default now(),
  ai_score        integer,          -- 1–10 clip quality score from Gemini
  processing_status text default 'pending', -- 'pending' | 'transcribed' | 'drafted' | 'failed'
  created_at      timestamptz not null default now()
);

-- AI-generated content drafts (per recording session or per trip)
create table public.content_drafts (
  id              uuid primary key default uuid_generate_v4(),
  trip_id         uuid references public.trips(id) on delete set null,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  source_asset_ids uuid[] default '{}',  -- media_assets that generated this draft
  draft_type      text not null,   -- 'blog' | 'caption_instagram' | 'caption_twitter' | 'reel_script' | 'whatsapp_summary' | 'youtube_description' | 'thread'
  title           text,
  content         text not null,
  metadata        jsonb default '{}',   -- hashtags, platform, word_count, etc.
  user_approved   boolean default false,
  user_edited     boolean default false,
  version         integer default 1,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);


-- =============================================================================
-- SOCIAL PUBLISHING (SocialLaunch)
-- =============================================================================

-- Connected social accounts
create table public.social_accounts (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  platform        text not null,    -- 'instagram' | 'youtube' | 'facebook' | 'snapchat' | 'twitter'
  platform_user_id text not null,
  platform_username text,
  access_token    text not null,    -- encrypted at rest (use Supabase vault in production)
  refresh_token   text,
  token_expires_at timestamptz,
  connected_at    timestamptz not null default now(),
  constraint unique_platform_account unique (user_id, platform)
);

-- Scheduled and published posts
create table public.published_posts (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  draft_id        uuid references public.content_drafts(id) on delete set null,
  trip_id         uuid references public.trips(id) on delete set null,
  platform        text not null,
  post_type       text not null,   -- 'feed' | 'reel' | 'story' | 'short' | 'long_form' | 'thread'
  status          text default 'scheduled', -- 'scheduled' | 'published' | 'failed'
  scheduled_for   timestamptz,
  published_at    timestamptz,
  platform_post_id text,           -- ID returned by the social API after publishing
  caption         text,
  media_urls      text[] default '{}',
  hashtags        text[] default '{}',
  created_at      timestamptz not null default now()
);

-- Performance analytics per post
create table public.post_analytics (
  id              uuid primary key default uuid_generate_v4(),
  post_id         uuid not null references public.published_posts(id) on delete cascade,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  platform        text not null,
  fetched_at      timestamptz not null default now(),
  reach           integer default 0,
  impressions     integer default 0,
  likes           integer default 0,
  comments        integer default 0,
  shares          integer default 0,
  saves           integer default 0,
  follower_delta  integer default 0,  -- net follower change after this post
  video_views     integer default 0,
  watch_time_sec  integer default 0
);

-- Nudge log (NudgeAgent — what was sent and whether acted upon)
create table public.nudge_log (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  trip_id         uuid references public.trips(id) on delete set null,
  nudge_type      text not null,   -- 'golden_hour' | 'milestone' | 'blog_prompt' | 'crowd_window' | 'safety' | 'trending_audio' | 'reel_moment'
  message         text not null,
  sent_at         timestamptz not null default now(),
  acted_on        boolean default false,
  dismissed       boolean default false
);


-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

alter table public.profiles                enable row level security;
alter table public.persona_profiles        enable row level security;
alter table public.trips                   enable row level security;
alter table public.itineraries             enable row level security;
alter table public.itinerary_days          enable row level security;
alter table public.itinerary_activities    enable row level security;
alter table public.trip_legs               enable row level security;
alter table public.fare_alerts             enable row level security;
alter table public.media_assets            enable row level security;
alter table public.content_drafts          enable row level security;
alter table public.social_accounts         enable row level security;
alter table public.published_posts         enable row level security;
alter table public.post_analytics          enable row level security;
alter table public.nudge_log               enable row level security;

-- Policy: users can only read/write their own rows
create policy "users_own_rows" on public.profiles           using (id = auth.uid());
create policy "users_own_rows" on public.persona_profiles   using (user_id = auth.uid());
create policy "users_own_rows" on public.trips              using (user_id = auth.uid());
create policy "users_own_rows" on public.itineraries        using (user_id = auth.uid());
create policy "users_own_rows" on public.media_assets       using (user_id = auth.uid());
create policy "users_own_rows" on public.content_drafts     using (user_id = auth.uid());
create policy "users_own_rows" on public.social_accounts    using (user_id = auth.uid());
create policy "users_own_rows" on public.published_posts    using (user_id = auth.uid());
create policy "users_own_rows" on public.post_analytics     using (user_id = auth.uid());
create policy "users_own_rows" on public.fare_alerts        using (user_id = auth.uid());
create policy "users_own_rows" on public.nudge_log          using (user_id = auth.uid());

-- Itinerary days and activities: access via parent itinerary ownership
create policy "access_via_itinerary" on public.itinerary_days
  using (itinerary_id in (select id from public.itineraries where user_id = auth.uid()));

create policy "access_via_day" on public.itinerary_activities
  using (day_id in (
    select d.id from public.itinerary_days d
    join public.itineraries i on i.id = d.itinerary_id
    where i.user_id = auth.uid()
  ));

create policy "access_via_trip" on public.trip_legs
  using (trip_id in (select id from public.trips where user_id = auth.uid()));

-- Public reads for destinations, archetypes, shot guides
create policy "public_read" on public.destinations        for select using (true);
create policy "public_read" on public.shot_guides         for select using (true);
create policy "public_read" on public.persona_archetypes  for select using (true);
create policy "public_read" on public.expeditions         for select using (true);


-- =============================================================================
-- INDEXES
-- =============================================================================

create index idx_trips_user_id          on public.trips(user_id);
create index idx_trips_start_date       on public.trips(start_date);
create index idx_itinerary_trip_id      on public.itineraries(trip_id);
create index idx_itinerary_days_itin    on public.itinerary_days(itinerary_id);
create index idx_media_assets_trip      on public.media_assets(trip_id);
create index idx_media_assets_user      on public.media_assets(user_id);
create index idx_published_posts_user   on public.published_posts(user_id);
create index idx_published_posts_status on public.published_posts(status, scheduled_for);
create index idx_post_analytics_post    on public.post_analytics(post_id);
create index idx_destinations_tags      on public.destinations using gin(tags);
create index idx_destinations_name_trgm on public.destinations using gin(name gin_trgm_ops);


-- =============================================================================
-- TRIGGERS: auto-update updated_at
-- =============================================================================

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

create trigger trg_trips_updated_at
  before update on public.trips
  for each row execute procedure public.set_updated_at();

create trigger trg_content_drafts_updated_at
  before update on public.content_drafts
  for each row execute procedure public.set_updated_at();

create trigger trg_persona_profiles_updated_at
  before update on public.persona_profiles
  for each row execute procedure public.set_updated_at();
