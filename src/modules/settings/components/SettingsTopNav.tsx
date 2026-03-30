"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { supabase } from "@/shared/config/supabase"
import { UiScaleWidget } from "@/components/atoms/UiScaleWidget"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useProfileQuery } from "../hooks/useProfileQuery"


export function SettingsTopNav() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { profile } = useProfileQuery()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  async function handleLogout() {
    setLoggingOut(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      window.location.href = "/login"
    } catch (err) {
      console.error("Logout failed:", err)
      setLoggingOut(false)
    }
  }

  return (
    <header className="flex items-center gap-4 px-6 py-3 border-b border-border/40 bg-card shrink-0">
      <Link
        href="/workspaces"
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
      >
        <span className="text-sm">←</span>
        <span>Back to Library</span>
      </Link>

      <div className="flex-1 min-w-0">
        <span className="text-sm font-semibold text-foreground">Settings</span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <UiScaleWidget />
        <div className="w-px h-4 bg-border/60" />

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="rounded-full hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="User menu"
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            <Avatar className="w-7 h-7">
              <AvatarImage src={profile?.avatarUrl ?? undefined} alt={profile?.displayName ?? "User"} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                {profile?.displayName?.[0]?.toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 rounded-md border border-border/60 bg-card shadow-lg z-50 py-1">
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-base" aria-hidden>
                  logout
                </span>
                {loggingOut ? "Logging out…" : "Log out"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
