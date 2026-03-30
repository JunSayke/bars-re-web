-- Migration: create snippets table
-- Change: workspace-editor-snippets-supabase-integration

CREATE TABLE snippets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE snippets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own snippets"
  ON snippets FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

ALTER TABLE snippets ADD CONSTRAINT snippets_content_length CHECK (char_length(content) <= 10000);
