import { SettingsTopNav } from "@/modules/settings/components/SettingsTopNav"

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <SettingsTopNav />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
