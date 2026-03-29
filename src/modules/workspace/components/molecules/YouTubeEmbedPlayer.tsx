import { toYouTubeEmbedUrl } from "../../utils/beat-link.utils"

interface YouTubeEmbedPlayerProps {
  url: string
}

export function YouTubeEmbedPlayer({ url }: YouTubeEmbedPlayerProps) {
  const embedSrc = toYouTubeEmbedUrl(url)

  return (
    <div className="overflow-hidden rounded-md">
      <iframe
        src={embedSrc}
        width="100%"
        height="152"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title="YouTube player"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox"
        style={{ border: "none", display: "block" }}
      />
    </div>
  )
}
