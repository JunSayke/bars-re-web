"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "@/components/atoms/Icon";
import Avatar from "@/components/atoms/Avatar";
import { useLogout } from "@/lib/auth/useAuth";
import { useSettings } from "@/contexts/settings";
import { useToast } from "@/contexts/toast";
import { useCurrentUser } from "@/lib/auth/useCurrentUser";


function SettingsMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { showTimestamps, showSyllables, setShowTimestamps, setShowSyllables } = useSettings();

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!open) return;
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open && menuRef.current) {
      const first = menuRef.current.querySelector<HTMLElement>("input, button, a");
      first?.focus();
    }
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button aria-label="Open settings" onClick={() => setOpen((s) => !s)} className={`flex items-center gap-3 px-3 py-1.5 rounded-full bg-[#0f1720] border border-[#233648] text-slate-300 transition-all focus:outline-none ${open ? 'ring-2 ring-primary/40 shadow-md' : 'hover:ring-2 hover:ring-primary/40 cursor-pointer'}`}>
        <span className="material-symbols-outlined text-[20px]">settings</span>
      </button>

      <div ref={menuRef} role="menu" aria-hidden={!open} className={`absolute top-full right-0 mt-2 w-72 bg-white dark:bg-[#1c2a38] rounded-xl shadow-2xl border border-slate-200 dark:border-[#2d4257] overflow-hidden z-50 transform transition-all ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <div className="px-4 py-3 space-y-3">
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Show Timestamps</span>
            <div className="relative">
              <input aria-label="Toggle timestamps" checked={showTimestamps} onChange={(e) => setShowTimestamps(e.target.checked)} className="sr-only peer" type="checkbox" />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </div>
          </label>

          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Show Syllable Counts</span>
            <div className="relative">
              <input aria-label="Toggle syllable counts" checked={showSyllables} onChange={(e) => setShowSyllables(e.target.checked)} className="sr-only peer" type="checkbox" />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}

function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { logout } = useLogout();
  const { success: toastSuccess } = useToast();
  const { data: currentUser } = useCurrentUser();

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!open) return;
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open && menuRef.current) {
      const first = menuRef.current.querySelector<HTMLElement>("a, button");
      first?.focus();
    }
  }, [open]);

  const handleLogout = async () => {
    try {
      await logout();
      toastSuccess("Signed out", 2000);
    } catch (e) {
      // ignore
      toastSuccess("Signed out", 2000);
    }
    setOpen(false);
    router.push("/login");
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        aria-label="Open profile menu"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all focus:outline-none ${open ? 'ring-2 ring-primary/50 shadow-md cursor-pointer' : 'hover:ring-2 hover:ring-primary/50 cursor-pointer'}`}
      >
        <Avatar name={currentUser?.name ?? 'JS'} src={currentUser?.avatar} size={28} className={open ? 'bg-primary text-white' : 'bg-primary/10 text-primary'} />
      </button>

      <div
        ref={menuRef}
        role="menu"
        aria-hidden={!open}
        className={`absolute right-0 top-full mt-2 w-56 rounded-lg bg-white dark:bg-[#1c2a38] border border-slate-200 dark:border-[#233648] shadow-xl py-1 z-50 origin-top-right transform transition-all ${
          open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="px-4 py-3 border-b border-slate-200 dark:border-[#233648]">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{currentUser?.name ?? 'Jay Smith'}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{currentUser?.email ?? 'jay.smith@bisaya.ai'}</p>
        </div>
        <div className="py-1">
          <Link href="/settings/profile" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2d4257] transition-colors cursor-pointer" role="menuitem" tabIndex={-1}>
            <span className="material-symbols-outlined text-[20px] text-slate-400 dark:text-slate-500">account_circle</span>
            My Profile
          </Link>
          <Link href="/settings/security" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2d4257] transition-colors cursor-pointer" role="menuitem" tabIndex={-1}>
            <span className="material-symbols-outlined text-[20px] text-slate-400 dark:text-slate-500">manage_accounts</span>
            Account Settings
          </Link>
        </div>
        <div className="border-t border-slate-200 dark:border-[#233648] my-1"></div>
        <div className="py-1">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left cursor-pointer" role="menuitem">
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export const HeaderWorkspace: React.FC = () => {
  return (
    <div className="h-16 border-b border-[#22303a] flex items-center justify-between px-6 bg-background-dark shrink-0">
      <div className="flex items-center gap-3 flex-1">
        <div className="flex items-center gap-3">
          <div className="text-primary">
            <span className="material-symbols-outlined text-[28px]">graphic_eq</span>
          </div>
          <h1 className="text-lg font-semibold tracking-tight">Bisaya AI Rap System</h1>
        </div>

        <div className="h-6 w-px bg-[#233648] mx-4" />

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm bg-[#0f1720] px-2 py-1 rounded text-slate-400 border border-[#233648]">
            <Icon name="timer" size={16} />
            <input className="bg-transparent text-slate-200 border-none rounded h-5 w-12 text-center text-sm p-0 focus:ring-0" placeholder="BPM" type="number" defaultValue={120} />
            <span className="text-xs font-medium text-slate-500">BPM</span>
          </div>

          {/* moved Time / Syl toggles into settings dropdown */}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#0f1720] border border-[#233648] text-slate-300">
            <span className="w-2 h-2 rounded-full bg-green-400 mr-2" />
            <span className="text-xs">System Online</span>
          </div>


        </div>

        <div className="hidden lg:flex items-center gap-3">
          <SettingsMenu />
        </div>

        <div className="relative">
          {/* Profile dropdown */}
          <ProfileMenu />
        </div>
      </div>
    </div>
  );
};

export default HeaderWorkspace;
