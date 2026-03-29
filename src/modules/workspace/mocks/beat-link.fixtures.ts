import type { BeatLink } from "../schemas/workspace.schema"

export const mockSpotifyBeatLink: BeatLink = {
  id: "beat-link-001",
  sessionId: "mock-session-1",
  url: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT",
  provider: "spotify",
  bpm: null,
}

export const mockYouTubeBeatLink: BeatLink = {
  id: "beat-link-002",
  sessionId: "mock-session-2",
  url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  provider: "youtube",
  bpm: null,
}

export const mockSoundCloudBeatLink: BeatLink = {
  id: "beat-link-003",
  sessionId: "mock-session-3",
  url: "https://soundcloud.com/artist-name/track-name",
  provider: "soundcloud",
  bpm: null,
}
