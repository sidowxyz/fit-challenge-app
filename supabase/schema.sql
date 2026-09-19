-- ==============================================================================
-- 100-DAY FITNESS CHALLENGE (Sept 19, 2026 - Dec 27, 2026)
-- Supabase PostgreSQL Database Schema with Row Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. CHALLENGES TABLE
create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  name text not null default '100-Day Fitness Challenge',
  invite_code text unique not null,
  start_date date not null default '2026-09-19',
  end_date date not null default '2026-12-27',
  created_by uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. CHALLENGE MEMBERS TABLE
create table if not exists public.challenge_members (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid references public.challenges(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (challenge_id, user_id)
);

-- 4. WORKOUT DAYS TABLE (Pre-populated for 100 days)
create table if not exists public.workout_days (
  id text primary key, -- e.g. 'day-1', 'day-2', ... 'day-100'
  day_number integer not null check (day_number between 1 and 100),
  date date not null,
  day_type text not null check (day_type in ('gym', 'football', 'rest')),
  workout_name text not null
);

-- 5. EXERCISES TABLE
create table if not exists public.exercises (
  id text primary key,
  workout_day_id text references public.workout_days(id) on delete cascade not null,
  name text not null,
  muscle_group text not null,
  sets integer not null default 3,
  min_reps integer not null default 8,
  max_reps integer not null default 12,
  sort_order integer not null default 0,
  is_optional boolean default false
);

-- 6. EXERCISE LOGS TABLE (User workout log sets)
create table if not exists public.exercise_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  exercise_id text not null,
  workout_day_id text not null,
  weight numeric not null check (weight >= 0),
  reps integer not null check (reps > 0),
  set_number integer not null check (set_number > 0),
  notes text,
  completed boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. WORKOUT COMPLETIONS TABLE
create table if not exists public.workout_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  workout_day_id text not null,
  completed boolean not null default true,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, workout_day_id)
);

-- 8. USER PREFERENCES TABLE
create table if not exists public.user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  units text not null default 'kg' check (units in ('kg', 'lb')),
  notifications_enabled boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.challenges enable row level security;
alter table public.challenge_members enable row level security;
alter table public.workout_days enable row level security;
alter table public.exercises enable row level security;
alter table public.exercise_logs enable row level security;
alter table public.workout_completions enable row level security;
alter table public.user_preferences enable row level security;

-- Profiles: Authenticated users can view profiles and manage their own
create policy "Users can view all member profiles"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- Workout Days & Exercises: Public read for all authenticated users
create policy "Anyone authenticated can view workout days"
  on public.workout_days for select
  to authenticated
  using (true);

create policy "Anyone authenticated can view exercises"
  on public.exercises for select
  to authenticated
  using (true);

-- Challenges: Authenticated users can create, read challenges they belong to or by invite code
create policy "Users can view challenges they are members of"
  on public.challenges for select
  to authenticated
  using (
    created_by = auth.uid() or
    exists (
      select 1 from public.challenge_members
      where challenge_members.challenge_id = challenges.id
      and challenge_members.user_id = auth.uid()
    )
  );

create policy "Users can create challenges"
  on public.challenges for insert
  to authenticated
  with check (auth.uid() = created_by);

-- Challenge Members: Members can view members of their challenges
create policy "Users can view challenge members"
  on public.challenge_members for select
  to authenticated
  using (
    user_id = auth.uid() or
    exists (
      select 1 from public.challenge_members cm
      where cm.challenge_id = challenge_members.challenge_id
      and cm.user_id = auth.uid()
    )
  );

create policy "Users can join challenges"
  on public.challenge_members for insert
  to authenticated
  with check (user_id = auth.uid());

-- Exercise Logs: Users manage their own logs, and challenge partners can view progress
create policy "Users can view their own and challenge partner logs"
  on public.exercise_logs for select
  to authenticated
  using (
    user_id = auth.uid() or
    exists (
      select 1 from public.challenge_members cm1
      join public.challenge_members cm2 on cm1.challenge_id = cm2.challenge_id
      where cm1.user_id = auth.uid() and cm2.user_id = exercise_logs.user_id
    )
  );

create policy "Users can insert their own exercise logs"
  on public.exercise_logs for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own exercise logs"
  on public.exercise_logs for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete their own exercise logs"
  on public.exercise_logs for delete
  to authenticated
  using (auth.uid() = user_id);

-- Workout Completions: Users manage their completions; challenge partners can view
create policy "Users can view completions of their challenge partners"
  on public.workout_completions for select
  to authenticated
  using (
    user_id = auth.uid() or
    exists (
      select 1 from public.challenge_members cm1
      join public.challenge_members cm2 on cm1.challenge_id = cm2.challenge_id
      where cm1.user_id = auth.uid() and cm2.user_id = workout_completions.user_id
    )
  );

create policy "Users can insert their own workout completions"
  on public.workout_completions for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own workout completions"
  on public.workout_completions for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete their own workout completions"
  on public.workout_completions for delete
  to authenticated
  using (auth.uid() = user_id);

-- User Preferences: Private to the user
create policy "Users can view their own preferences"
  on public.user_preferences for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own preferences"
  on public.user_preferences for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own preferences"
  on public.user_preferences for update
  to authenticated
  using (auth.uid() = user_id);

-- ==============================================================================
-- AUTOMATIC PROFILE TRIGGER ON SIGNUP
-- ==============================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', null)
  );
  
  insert into public.user_preferences (user_id, units, notifications_enabled)
  values (new.id, 'kg', false);
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to execute on auth.users insert
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
