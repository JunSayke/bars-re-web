"use client"

import { useMutation } from "@tanstack/react-query"
import type { BeatRecord } from "../types/beat.types"

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

async function importBeat(sessionId: string, file: File): Promise<BeatRecord> {
  const form = new FormData()
  form.append("file", file)
  const res = await fetch(`${BASE}/sessions/${sessionId}/beat`, {
    method: "POST",
    body: form,
  })
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string }
    throw new Error(body.message ?? "Failed to import beat")
  }
  return res.json() as Promise<BeatRecord>
}

export function useImportBeatMutation(sessionId: string) {
  const { mutate, isPending, isError, error } = useMutation<BeatRecord, Error, File>({
    mutationFn: (file: File) => importBeat(sessionId, file),
  })

  return { mutate, isPending, isError, error }
}
