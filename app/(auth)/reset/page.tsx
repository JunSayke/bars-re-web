import React from "react";
import Link from "next/link";
import ResetForm from "../../../src/components/organisms/ResetForm";

export const metadata = {
  title: "Reset Password - Bisaya AI Rap System",
};

export default function ResetPasswordPage() {
  return (
    <div className="flex-1 bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-[#2f2348] px-6 lg:px-10 py-4 bg-white dark:bg-[#171122]">
        <div className="flex items-center gap-3 text-slate-900 dark:text-white">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary">
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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="w-full mx-auto max-w-md md:max-w-lg bg-white dark:bg-[#221933] rounded-2xl shadow-xl border border-slate-100 dark:border-[#2f2348] overflow-hidden z-10">
          <div className="pt-10 pb-2 px-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
              <span className="material-symbols-outlined text-[32px]">lock_reset</span>
            </div>
            <h1 className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold leading-tight mb-2">Reset Password</h1>
            <p className="text-slate-500 dark:text-[#a492c9] text-base font-normal leading-relaxed">Secure your account to get back to the beat.</p>
          </div>

          <div className="p-8 pt-6">
            <ResetForm />

            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm font-medium text-slate-500 dark:text-[#a492c9] hover:text-primary dark:hover:text-white transition-colors flex items-center justify-center gap-1 group">
                <span className="material-symbols-outlined text-[16px] transition-transform group-hover:-translate-x-1">arrow_back</span>
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
