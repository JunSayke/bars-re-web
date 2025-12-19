"use client";
import Link from "next/link";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLogout } from "@/lib/auth/useAuth";
import { useToast } from "@/contexts/toast";

export default function SettingsSidebar() {
  const pathname = usePathname();
  const isProfile = pathname?.startsWith("/settings/profile");
  const isSecurity = pathname?.startsWith("/settings/security");

  return (
    <div className="p-4 flex flex-col h-full">
      <div className="flex flex-col gap-2 mb-6">
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#a492c9] hover:bg-[#221933] hover:text-white transition-all group">
          <span className="material-symbols-outlined text-[22px]">home</span>
          <span className="text-sm font-medium leading-normal">Home</span>
        </Link>
        <Link href="/editor/workspace" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#a492c9] hover:bg-[#221933] hover:text-white transition-all group">
          <span className="material-symbols-outlined text-[22px]">grid_view</span>
          <span className="text-sm font-medium leading-normal">Workspace</span>
        </Link>
      </div>

      <div className="h-px bg-[#2f2348] mx-3 mb-6" />

      <div className="flex flex-col gap-2">
        <h3 className="text-[#a492c9] text-xs font-bold uppercase tracking-wider px-3 mb-1">Account Settings</h3>
        <Link href="/settings/profile" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isProfile ? 'bg-linear-to-r from-[#6b21a8] to-[#5b13ec] text-white shadow-lg' : 'text-[#a492c9] hover:bg-[#221933] hover:text-white'}`}>
          <span className={`material-symbols-outlined text-[22px] ${isProfile ? 'fill-1' : ''}`}>person</span>
          <span className="text-sm font-medium leading-normal">Profile</span>
        </Link>
        <Link href="/settings/security" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isSecurity ? 'bg-linear-to-r from-[#6b21a8] to-[#5b13ec] text-white shadow-lg' : 'text-[#a492c9] hover:bg-[#221933] hover:text-white'}`}>
          <span className={`material-symbols-outlined text-[22px] ${isSecurity ? 'fill-1' : ''}`}>lock</span>
          <span className="text-sm font-medium leading-normal">Security</span>
        </Link>
      </div>

      <div className="flex-1" />

      <div className="border-t border-[#2f2348] pt-4">
        <LogoutButton />
      </div>
    </div>
  );
}
function LogoutButton() {
  const { logout } = useLogout();
  const router = useRouter();
  const { success: toastSuccess } = useToast();
  const handle = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await logout();
      toastSuccess("Signed out", 2000);
    } catch (e) {
      toastSuccess("Signed out", 2000);
    }
    router.push('/login');
  };
  return (
    <button onClick={handle} className="flex items-center justify-start w-full gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer">
      <span className="material-symbols-outlined text-[22px]">logout</span>
      <span className="text-sm font-medium leading-normal">Logout</span>
    </button>
  );
}