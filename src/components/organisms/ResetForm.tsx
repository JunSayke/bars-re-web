"use client";
import React, { useMemo, useState } from "react";
import Button from "@/components/atoms/Button";
import PasswordField from "@/components/molecules/PasswordField";

function hasUppercase(s: string) { return /[A-Z]/.test(s); }
function hasNumber(s: string) { return /[0-9]/.test(s); }
function hasSpecial(s: string) { return /[^A-Za-z0-9]/.test(s); }

export default function ResetForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const requirements = useMemo(() => ({
    length: password.length >= 8,
    uppercase: hasUppercase(password),
    number: hasNumber(password),
    special: hasSpecial(password),
  }), [password]);

  const ok = requirements.length && requirements.uppercase && requirements.number && requirements.special && password === confirm;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!ok) {
      alert("Password does not satisfy requirements or confirmation doesn't match");
      return;
    }

    // TODO: Call API to set new password using token
    setPassword("");
    setConfirm("");
    alert("Password reset (demo)");
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <PasswordField id="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter new password" autoComplete="new-password" showForgot={false} />
      </div>

      <div className="flex flex-col gap-2">
        <PasswordField id="confirm-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter new password" autoComplete="new-password" showForgot={false} />
      </div>

      <div className="bg-slate-50 dark:bg-[#171122]/50 rounded-xl p-4 border border-slate-100 dark:border-[#2f2348]">
        <p className="text-xs font-semibold text-slate-500 dark:text-[#a492c9] uppercase tracking-wider mb-3">Password Requirements</p>
        <ul className="space-y-2">
          <li className={`flex items-center gap-2 text-sm ${requirements.length ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}><span className={`material-symbols-outlined text-[18px] ${requirements.length ? 'text-green-500' : 'text-slate-300'}`}>check_circle</span>Must be at least 8 characters</li>
          <li className={`flex items-center gap-2 text-sm ${requirements.number ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}><span className={`material-symbols-outlined text-[18px] ${requirements.number ? 'text-green-500' : 'text-slate-300'}`}>{requirements.number ? 'check_circle' : 'circle'}</span>Include at least one number</li>
          <li className={`flex items-center gap-2 text-sm ${requirements.special ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}><span className={`material-symbols-outlined text-[18px] ${requirements.special ? 'text-green-500' : 'text-slate-300'}`}>{requirements.special ? 'check_circle' : 'circle'}</span>Include one special character</li>
        </ul>
      </div>

      <Button variant="purple" size="lg" className="w-full mt-2" type="submit" disabled={!ok}>
        <span className="flex items-center justify-center gap-2 w-full">
          <span>Update Password</span>
          <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">arrow_forward</span>
        </span>
      </Button>
    </form>
  );
}
