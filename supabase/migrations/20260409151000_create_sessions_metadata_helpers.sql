-- Create helper functions to clear beat references from sessions.metadata
BEGIN;

CREATE OR REPLACE FUNCTION public.sessions_clear_beat_file_reference(p_beat_file_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.sessions
  SET metadata = metadata - 'beat_file_id'
  WHERE (metadata->>'beat_file_id') = p_beat_file_id::text;
END;
$$;

CREATE OR REPLACE FUNCTION public.sessions_clear_beat_link_reference(p_beat_link_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.sessions
  SET metadata = metadata - 'beat_link_id'
  WHERE (metadata->>'beat_link_id') = p_beat_link_id::text;
END;
$$;

COMMIT;
