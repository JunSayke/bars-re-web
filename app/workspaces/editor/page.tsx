import { Suspense } from "react"
import { EditorPage } from "@/modules/workspace/components/EditorPage"

export default function Page() {
  return (
    <Suspense>
      <EditorPage />
    </Suspense>
  )
}

