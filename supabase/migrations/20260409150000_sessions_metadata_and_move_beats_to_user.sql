-- Migration: sessions metadata + move beat ownership from session_id -> user_id
-- Adds metadata jsonb to sessions (stores active beat_file_id and beat_link_id)
-- Adds user_id to beat_files and beat_links (populated from sessions.user_id)
-- Removes session_id from beat_files and beat_links and updates RLS policies to use user_id

BEGIN;

-- 1) Add metadata column to sessions (if it doesn't already exist)
ALTER TABLE public.sessions
  ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- 2) Backfill sessions.metadata.beat_file_id with the most-recent beat_files.id per session
WITH latest_beat_files AS (
  SELECT DISTINCT ON (session_id) session_id, id
  FROM public.beat_files
  ORDER BY session_id, COALESCE(created_at, now()) DESC, id DESC
)
UPDATE public.sessions s
SET metadata = jsonb_set(COALESCE(s.metadata, '{}'::jsonb), '{beat_file_id}', to_jsonb(lbf.id::text), true)
FROM latest_beat_files lbf
WHERE lbf.session_id = s.id;

-- 3) Backfill sessions.metadata.beat_link_id with the most-recent beat_links.id per session
WITH latest_beat_links AS (
  SELECT DISTINCT ON (session_id) session_id, id
  FROM public.beat_links
  ORDER BY session_id, COALESCE(created_at, now()) DESC, id DESC
)
UPDATE public.sessions s
SET metadata = jsonb_set(COALESCE(s.metadata, '{}'::jsonb), '{beat_link_id}', to_jsonb(ll.id::text), true)
FROM latest_beat_links ll
WHERE ll.session_id = s.id;

-- 4) Add user_id columns to beat_files and beat_links
ALTER TABLE public.beat_files
  ADD COLUMN IF NOT EXISTS user_id uuid;

ALTER TABLE public.beat_links
  ADD COLUMN IF NOT EXISTS user_id uuid;

-- 5) Populate new user_id columns from sessions.user_id
UPDATE public.beat_files b
SET user_id = s.user_id
FROM public.sessions s
WHERE b.session_id = s.id
  AND (b.user_id IS NULL OR b.user_id <> s.user_id);

UPDATE public.beat_links bl
SET user_id = s.user_id
FROM public.sessions s
WHERE bl.session_id = s.id
  AND (bl.user_id IS NULL OR bl.user_id <> s.user_id);

-- 6) Add foreign key constraints on user_id -> auth.users(id) (if they don't already exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'beat_files_user_id_fkey') THEN
    EXECUTE 'ALTER TABLE public.beat_files ADD CONSTRAINT beat_files_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'beat_links_user_id_fkey') THEN
    EXECUTE 'ALTER TABLE public.beat_links ADD CONSTRAINT beat_links_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE';
  END IF;
END$$;

-- 7) Add helpful indexes on user_id
CREATE INDEX IF NOT EXISTS idx_beat_files_user_id ON public.beat_files (user_id);
CREATE INDEX IF NOT EXISTS idx_beat_links_user_id ON public.beat_links (user_id);

-- 8) Drop legacy RLS policies that reference session_id before removing the column
-- (these policies were created in earlier migrations and depend on session_id)
DROP POLICY IF EXISTS "Users manage beat links for their own sessions" ON public.beat_links;
DROP POLICY IF EXISTS "Users manage their beat files" ON public.beat_files;
DROP POLICY IF EXISTS "beat_files: owner access via session" ON public.beat_files;

-- 9) Remove foreign key constraints that referenced sessions (if present)
ALTER TABLE public.beat_files DROP CONSTRAINT IF EXISTS beat_files_session_id_fkey;
ALTER TABLE public.beat_links DROP CONSTRAINT IF EXISTS beat_links_session_id_fkey;

-- 10) Drop the session_id columns (ownership is now user-based)
ALTER TABLE public.beat_files DROP COLUMN IF EXISTS session_id;
ALTER TABLE public.beat_links DROP COLUMN IF EXISTS session_id;

-- 11) Replace RLS policies that granted access via the session -> user join

-- Create new policies that check the user_id directly
CREATE POLICY "Users manage beat links by user_id" ON public.beat_links
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users manage their beat files by user_id" ON public.beat_files
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Ensure RLS is enabled (no-op if already enabled)
ALTER TABLE public.beat_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beat_files ENABLE ROW LEVEL SECURITY;

COMMIT;
