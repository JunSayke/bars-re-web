"use client";
import React, { useState } from "react";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const ForgotForm: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailEl = document.getElementById('email') as HTMLInputElement | null;
    const email = emailEl?.value ?? '';
    if (!email) {
      setMessage('Please provide an email address');
      setTimeout(() => setMessage(null), 4000);
      return;
    }

    setMessage(`If an account exists, a reset link was sent to ${email}`);
    // After a short delay, navigate back to login page
    setTimeout(() => {
      setMessage(null);
      router.push('/login');
    }, 1200);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-[#221933] rounded-2xl shadow-xl border border-slate-100 dark:border-[#2f2348] overflow-hidden z-10">
      <div className="pt-10 pb-2 px-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-linear-to-br from-[#6b21a8] to-[#5b13ec] text-white mb-6 shadow-lg">
          <span className="material-symbols-outlined text-[20px]">lock</span>
        </div>
        <h1 className="text-slate-900 dark:text-white tracking-tight text-3xl md:text-4xl font-black leading-tight mb-4">Forgot Password</h1>
        <p className="text-slate-400 dark:text-[#a492c9] text-sm font-normal leading-snug">Enter your email to receive a password reset link.</p>
      </div>

      <div className="p-8 pt-6">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit} aria-label="Forgot password form">
          <div className="flex flex-col gap-2">
            <label className="text-slate-900 dark:text-white text-sm font-semibold leading-normal" htmlFor="email">Email Address</label>
            <div className="relative flex w-full items-center">
              <div className="flex-1">
<Input id="email" name="email" type="email" placeholder="name@example.com" autoComplete="email" inputClassName="w-full rounded-xl border border-slate-300 dark:border-[#443267] bg-slate-50 dark:bg-[#171122] h-14 px-6 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#a492c9] text-base focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none shadow-inner" />
              </div>
            </div>
          </div>

          <Button variant="purple" type="submit" className="w-full mt-2 group px-10" size="lg"><span>Send Reset Link</span><span className="material-symbols-outlined text-[20px] shrink-0 transition-transform group-hover:translate-x-1">arrow_forward</span></Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm font-medium text-slate-500 dark:text-[#a492c9] hover:text-primary dark:hover:text-white transition-colors flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Login
          </Link>
        </div>

        <div aria-live="polite" className="mt-4">
          {message ? (
            <div role="status" className="rounded-md bg-green-100 px-4 py-2 text-sm text-green-800">{message}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ForgotForm;
