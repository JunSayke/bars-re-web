export type BeatLinkProvider = "spotify" | "youtube" | "soundcloud"

/**
 * Detects the music platform from a given URL.
 */
export function detectProvider(url: string): BeatLinkProvider {
  if (/open\.spotify\.com\//i.test(url)) return "spotify"
  if (/(?:youtube\.com\/watch|youtu\.be\/)/i.test(url)) return "youtube"
  if (/soundcloud\.com\//i.test(url)) return "soundcloud"
  // Default fallback — schema validation should prevent reaching this
  return "spotify"
}

/**
 * Converts a standard Spotify URL to an embed URL.
 *
 * Input:  https://open.spotify.com/(intl-xx/)?(track|album|playlist)/<id>
 * Output: https://open.spotify.com/embed/<type>/<id>?utm_source=generator
 */
export function toSpotifyEmbedUrl(url: string): string {
  const match = url.match(
    /open\.spotify\.com\/(?:intl-[a-z-]+\/)?(track|album|playlist)\/([A-Za-z0-9]+)/
  )
  if (!match) return url
  const [, type, id] = match
  return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator`
}

/**
 * Converts a YouTube watch or short URL to an embed URL.
 *
 * Accepts:
 *   https://www.youtube.com/watch?v=<id>
 *   https://youtu.be/<id>
 */
export function toYouTubeEmbedUrl(url: string): string {
  // Short URL: youtu.be/<id>
  const shortMatch = url.match(/youtu\.be\/([A-Za-z0-9_-]{11})/)
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`

  // Watch URL: youtube.com/watch?v=<id>
  const watchMatch = url.match(/youtube\.com\/watch\?(?:[^&]*&)*v=([A-Za-z0-9_-]{11})/)
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`

  return url
}

/**
 * Converts a SoundCloud track URL to a SoundCloud widget iframe URL.
 */
export function toSoundCloudEmbedUrl(url: string): string {
  const params = new URLSearchParams({
    url: url,
    color: "%23ff5500",
    auto_play: "false",
    hide_related: "true",
    show_comments: "false",
    show_user: "true",
    show_reposts: "false",
    show_teaser: "false",
    visual: "false",
  })
  return `https://w.soundcloud.com/player/?${params.toString()}`
}

/**
 * Dispatches to the correct embed URL builder based on provider.
 */
export function toBeatLinkEmbedUrl(url: string, provider: BeatLinkProvider): string {
  switch (provider) {
    case "spotify":
      return toSpotifyEmbedUrl(url)
    case "youtube":
      return toYouTubeEmbedUrl(url)
    case "soundcloud":
      return toSoundCloudEmbedUrl(url)
  }
}
