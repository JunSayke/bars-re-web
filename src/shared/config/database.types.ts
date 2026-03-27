// Auto-generated types for the Supabase database schema.
// Keep in sync with the Supabase project schema.
// Re-generate with: supabase gen types typescript --project-id <id> > src/shared/config/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      sessions: {
        Row: {
          id: string
          user_id: string
          title: string
          topic: string | null
          bar_content: string | null
          last_modified_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          topic?: string | null
          bar_content?: string | null
          last_modified_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          topic?: string | null
          bar_content?: string | null
          last_modified_at?: string
          created_at?: string
        }
        Relationships: []
      }
      beat_files: {
        Row: {
          id: string
          session_id: string
          storage_path: string
          bpm: number | null
          file_size_bytes: number | null
          source_type: string | null
        }
        Insert: {
          id?: string
          session_id: string
          storage_path: string
          bpm?: number | null
          file_size_bytes?: number | null
          source_type?: string | null
        }
        Update: {
          id?: string
          session_id?: string
          storage_path?: string
          bpm?: number | null
          file_size_bytes?: number | null
          source_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "beat_files_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      snippets: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
