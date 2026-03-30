"use client"

import { useState, useRef, useEffect } from "react"
import { supabase } from "@/shared/config/supabase"
import { UiScaleWidget } from "@/components/atoms/UiScaleWidget"

interface WorkspacesTopNavProps {
  onSettingsClick?: () => void
}

export function WorkspacesTopNav({ onSettingsClick }: WorkspacesTopNavProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
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
      // Redirect or update app state after logout
      window.location.href = "/login" // adjust to your login route
    } catch (err) {
      console.error("Logout failed:", err)
      setLoggingOut(false)
    }
  }

  return (
    <header className="flex items-center justify-end gap-2 px-6 py-3 border-b border-border/40 bg-card shrink-0">
      <UiScaleWidget />
      <div className="w-px h-4 bg-border/60" />
      <button
        type="button"
        onClick={onSettingsClick}
        className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        aria-label="Settings"
      >
        <span className="material-symbols-outlined text-base" aria-hidden>
          settings
        </span>
      </button>

      {/* User avatar + dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground select-none hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="User menu"
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
        >
          U
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
    </header>
  )
}