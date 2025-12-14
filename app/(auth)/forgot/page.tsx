import React from "react";
import ForgotForm from "@/components/organisms/ForgotForm";
import Link from "next/link";

export default function ForgotPage() {
  return (
    <div className="dark min-h-screen flex-1 flex flex-col font-display bg-background-light dark:bg-background-dark">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-[#2f2348] px-6 lg:px-10 py-4 bg-white dark:bg-[#171122]">
        <div className="flex items-center gap-3 text-slate-900 dark:text-white">
          <div className="flex items-center justify-center size-8 rounded-lg bg-primary/20 text-primary">
            <span className="material-symbols-outlined">graphic_eq</span>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Bisaya AI Rap System</h2>
        </div>
        <div className="hidden sm:flex gap-4">
          <button className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors">Help</button>
          <button className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors">Contact Support</button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none"></div>

        <ForgotForm />
      </main>
    </div>
  );
}
