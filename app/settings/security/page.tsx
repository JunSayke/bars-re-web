import React from "react";
import SettingsSidebar from "@/components/organisms/SettingsSidebar";
import SecurityForm from "@/components/organisms/SecurityForm";

export const metadata = {
  title: "Change Password - Bisaya AI Rap System",
};

export default function SettingsSecurityPage() {
  return (
    <div className="bg-background-dark text-slate-100 h-screen overflow-hidden flex flex-col font-display">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#2f2348] px-6 py-3 bg-background-dark shrink-0 z-20">
        <div className="flex items-center gap-4 text-white">
          <div className="w-8 h-8 flex items-center justify-center rounded bg-primary/20 text-primary">
            <span className="material-symbols-outlined text-2xl">graphic_eq</span>
          </div>
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Bisaya AI Rap System</h2>
        </div>
        <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#221933] hover:bg-[#2f2348] transition-colors text-white text-sm font-bold leading-normal tracking-[0.015em] border border-[#2f2348]">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">help</span>
            <span className="truncate">Help &amp; Support</span>
          </span>
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <aside className="hidden md:flex md:flex-col w-64 border-r border-[#2f2348] bg-background-dark shrink-0">
          <SettingsSidebar />
        </aside>

        <main className="flex-1 overflow-y-auto bg-background-dark p-6 md:p-10 relative">
          <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[#2f2348]/20 to-transparent pointer-events-none" />

          <div className="max-w-[800px] mx-auto relative z-10 flex flex-col gap-8">
            <div className="flex flex-col gap-2 border-b border-[#2f2348] pb-6">
              <h1 className="text-white tracking-tight text-[32px] font-bold leading-tight">Change Password</h1>
              <p className="text-[#a492c9] text-sm font-normal leading-normal max-w-lg">
                Update your password to keep your account secure. We recommend using a unique password that you don't use for other online accounts.
              </p>
            </div>

            <SecurityForm />
          </div>
        </main>
      </div>
    </div>
  );
}
