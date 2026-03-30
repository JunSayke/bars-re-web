create table public.beat_links (
  id           uuid primary key default gen_random_uuid(),
  session_id   uuid not null references sessions(id) on delete cascade,
  url          varchar(2048) not null,
  provider     varchar(20) not null default 'spotify',
  bpm          integer null
);

alter table public.beat_links enable row level security;

create policy "Users manage beat links for their own sessions"
  on public.beat_links for all to authenticated
  using (
    exists (
      select 1 from public.sessions
      where sessions.id = beat_links.session_id
        and sessions.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.sessions
      where sessions.id = beat_links.session_id
        and sessions.user_id = auth.uid()
    )
  );
