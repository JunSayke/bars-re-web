"use client"

import { useRef } from "react"
import { toast } from "sonner"
import { FileMusic } from "lucide-react"
import { useBeatPlayer } from "../../hooks/useBeatPlayer"
import { BeatTransportControls } from "../molecules/BeatTransportControls"
import { BpmBadge } from "../atoms/BpmBadge"
import { BeatProgressBar } from "../atoms/BeatProgressBar"

const ACCEPTED_TYPES = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/x-wav"]
const ACCEPTED_EXTENSIONS = [".mp3", ".wav", ".ogg"]
const MAX_SIZE_BYTES = 20 * 1024 * 1024 // 20 MB

export function BeatPlayerBar({ sessionId }: { sessionId: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { loadFile, togglePlay, skipBack, skipForward, seek, isPlaying, currentTime, duration, bpm, fileName } =
    useBeatPlayer(sessionId)

  const beatLoaded = fileName !== null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset so the same file can be re-selected later
    e.target.value = ""

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Unsupported file format. Please upload an MP3, WAV, or OGG file.")
      return
    }
    if (file.size > MAX_SIZE_BYTES) {
      toast.error("File is too large. Maximum allowed size is 20 MB.")
      return
    }

    loadFile(file)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full border-t border-border bg-card px-4 py-3 flex items-center gap-4 flex-shrink-0">
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS.join(",")}
        className="hidden"
        onChange={handleFileChange}
        aria-label="Upload beat file"
      />

      {!beatLoaded ? (
        /* Upload trigger */
        <button
          type="button"
          onClick={handleUploadClick}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <FileMusic className="h-5 w-5 flex-shrink-0" />
          <div className="flex flex-col items-start leading-tight">
            <span className="text-xs font-semibold uppercase tracking-wide">Upload Beat</span>
            <span className="text-[10px] text-muted-foreground">MP3 / WAV / OGG &mdash; max 20 MB</span>
          </div>
        </button>
      ) : (
        /* Player layout: left | center | right */
        <>
          {/* Left: file info */}
          <button
            type="button"
            onClick={handleUploadClick}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors min-w-0"
            aria-label="Replace beat file"
          >
            <FileMusic className="h-4 w-4 flex-shrink-0" />
            <div className="flex flex-col items-start leading-tight min-w-0">
              <span className="text-xs font-medium truncate max-w-[140px]">{fileName}</span>
              <span className="text-[10px] text-muted-foreground">MP3 / WAV / OGG</span>
            </div>
          </button>

          {/* Center: transport */}
          <div className="flex-1 flex justify-center">
            <BeatTransportControls
              isPlaying={isPlaying}
              onTogglePlay={togglePlay}
              onSkipBack={skipBack}
              onSkipForward={skipForward}
            />
          </div>

          {/* Right: BPM + progress */}
          <div className="flex items-center gap-3">
            {bpm !== null && <BpmBadge bpm={bpm} />}
            <BeatProgressBar currentTime={currentTime} duration={duration} onSeek={seek} />
          </div>
        </>
      )}
    </div>
  )
}
