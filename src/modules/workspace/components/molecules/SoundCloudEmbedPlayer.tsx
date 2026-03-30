import { toSoundCloudEmbedUrl } from "../../utils/beat-link.utils"

interface SoundCloudEmbedPlayerProps {
  url: string
}

export function SoundCloudEmbedPlayer({ url }: SoundCloudEmbedPlayerProps) {
  const embedSrc = toSoundCloudEmbedUrl(url)

  return (
    <div className="h-full overflow-hidden rounded-md">
      <iframe
        src={embedSrc}
        width="100%"
        height="100%"
        allow="autoplay"
        loading="lazy"
        title="SoundCloud player"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox"
        style={{ border: "none", display: "block" }}
      />
    </div>
  )
}
