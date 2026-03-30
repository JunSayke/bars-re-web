import { Suspense } from "react"
import { ProfilePage } from "@/modules/settings"
import { profileMeta } from "@/modules/settings/meta"

export const metadata = profileMeta

export default function SettingsProfileRoute() {
  return (
    <Suspense>
      <ProfilePage />
    </Suspense>
  )
}
