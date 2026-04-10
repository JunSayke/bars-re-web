"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { useImportBeatMutation } from "./useImportBeatMutation"

interface BeatPlayerState {
  isPlaying: boolean
  isLoadingAudio: boolean
  currentTime: number
  duration: number
  bpm: number | null
  fileName: string | null
}

export interface UseBeatPlayerReturn extends BeatPlayerState {
  isUploading: boolean
  loadFile: (file: File) => void
  loadUrl: (url: string, metadata: { fileName: string; bpm: number | null }) => void
  togglePlay: () => void
  skipBack: () => void
  skipForward: () => void
  seek: (time: number) => void
}

const SKIP_INTERVAL_SECONDS = 5

export function useBeatPlayer(sessionId: string): UseBeatPlayerReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const objectUrlRef = useRef<string | null>(null)

  const [state, setState] = useState<BeatPlayerState>({
    isPlaying: false,
    isLoadingAudio: false,
    currentTime: 0,
    duration: 0,
    bpm: null,
    fileName: null,
  })

  const { mutate: importBeat, isPending: isUploading } = useImportBeatMutation(sessionId)

  // Initialise the audio element once on mount
  useEffect(() => {
    const audio = new Audio()
    audioRef.current = audio

    const onTimeUpdate = () => {
      setState((prev) => ({ ...prev, currentTime: audio.currentTime }))
    }
    const onDurationChange = () => {
      setState((prev) => ({ ...prev, duration: audio.duration || 0 }))
    }
    const onEnded = () => {
      setState((prev) => ({ ...prev, isPlaying: false, currentTime: 0 }))
    }
    const onCanPlay = () => {
      setState((prev) => ({ ...prev, isLoadingAudio: false }))
    }
    const onError = () => {
      setState((prev) => ({ ...prev, isLoadingAudio: false }))
    }

    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("durationchange", onDurationChange)
    audio.addEventListener("ended", onEnded)
    audio.addEventListener("canplay", onCanPlay)
    audio.addEventListener("error", onError)

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate)
      audio.removeEventListener("durationchange", onDurationChange)
      audio.removeEventListener("ended", onEnded)
      audio.removeEventListener("canplay", onCanPlay)
      audio.removeEventListener("error", onError)
      audio.pause()
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
      }
    }
  }, [])

  const loadFile = useCallback(
    (file: File) => {
      const audio = audioRef.current
      if (!audio) return

      // Revoke previous object URL to prevent memory leak
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
      }

      const url = URL.createObjectURL(file)
      objectUrlRef.current = url

      audio.pause()
      audio.src = url
      audio.load()

      setState((prev) => ({
        ...prev,
        isPlaying: false,
        isLoadingAudio: true,
        currentTime: 0,
        duration: 0,
        fileName: file.name,
        bpm: null,
      }))

      // Upload to server and get BPM + signed URL
      importBeat(file, {
        onSuccess: (record) => {
          setState((prev) => ({ ...prev, bpm: record.bpm, fileName: record.fileName }))
        },
        onError: (error) => {
          toast.error(error.message || "Failed to upload beat. Please try again.")
          setState((prev) => ({ ...prev, fileName: null, bpm: null, isLoadingAudio: false }))
        },
      })
    },
    [importBeat]
  )

  const loadUrl = useCallback(
    (url: string, metadata: { fileName: string; bpm: number | null }) => {
      const audio = audioRef.current
      if (!audio) return

      audio.pause()
      audio.src = url
      audio.load()

      setState((prev) => ({
        ...prev,
        isPlaying: false,
        isLoadingAudio: true,
        currentTime: 0,
        duration: 0,
        fileName: metadata.fileName,
        bpm: metadata.bpm,
      }))
    },
    []
  )

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !audio.src) return
    if (audio.paused) {
      void audio.play()
      setState((prev) => ({ ...prev, isPlaying: true }))
    } else {
      audio.pause()
      setState((prev) => ({ ...prev, isPlaying: false }))
    }
  }, [])

  const skipBack = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    const next = Math.max(audio.currentTime - SKIP_INTERVAL_SECONDS, 0)
    audio.currentTime = next
    setState((prev) => ({ ...prev, currentTime: next }))
  }, [])

  const skipForward = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    const next = Math.min(audio.currentTime + SKIP_INTERVAL_SECONDS, audio.duration || 0)
    audio.currentTime = next
    setState((prev) => ({ ...prev, currentTime: next }))
  }, [])

  const seek = useCallback((time: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = time
    setState((prev) => ({ ...prev, currentTime: time }))
  }, [])

  return {
    ...state,
    isUploading,
    loadFile,
    loadUrl,
    togglePlay,
    skipBack,
    skipForward,
    seek,
  }
}
