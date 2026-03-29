import { toSpotifyEmbedUrl } from "../../utils/beat-link.utils"

interface SpotifyEmbedPlayerProps {
  url: string
}

export function SpotifyEmbedPlayer({ url }: SpotifyEmbedPlayerProps) {
  const embedSrc = toSpotifyEmbedUrl(url)

  return (
    <div className="overflow-hidden rounded-md">
      <iframe
        src={embedSrc}
        width="100%"
        height="152"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title="Spotify player"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox"
        style={{ border: "none", display: "block" }}
      />
    </div>
  )
}
