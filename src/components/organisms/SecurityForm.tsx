"use client";
import React, { useMemo, useState } from "react";
import Button from "@/components/atoms/Button";

function hasUppercase(s: string) { return /[A-Z]/.test(s); }
function hasNumber(s: string) { return /[0-9]/.test(s); }
function hasSpecial(s: string) { return /[^A-Za-z0-9]/.test(s); }

export default function SecurityForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const requirements = useMemo(() => ({
    length: newPassword.length >= 8,
    uppercase: hasUppercase(newPassword),
    number: hasNumber(newPassword),
    special: hasSpecial(newPassword),
  }), [newPassword]);

  const allOk = requirements.length && requirements.uppercase && requirements.number && requirements.special && newPassword === confirmPassword && currentPassword.length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!allOk) return alert("Password does not meet requirements or confirmation doesn't match");
    // TODO: Call backend API to update password
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    alert("Password updated (demo)");
  }

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2 max-w-[480px]">
        <label className="text-white text-sm font-semibold leading-normal">Current Password</label>
        <div className="flex w-full items-stretch rounded-lg shadow-sm border border-[#443267] bg-[#221933] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/50 input-with-toggle">
          <input
            className="form-input flex-1 resize-none overflow-hidden rounded-l-lg text-white focus:outline-0 bg-transparent h-12 placeholder:text-[#a492c9]/50 px-4 text-sm font-normal leading-normal"
            placeholder="Enter your current password"
            type={showCurrent ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            aria-label="Current password"
          />
          <button type="button" onClick={() => setShowCurrent(v => !v)} className="text-[#a492c9] flex bg-transparent items-center justify-center px-3 rounded-r-lg cursor-pointer hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">{showCurrent ? 'visibility' : 'visibility_off'}</span>
          </button>
        </div>
        <p className="text-xs text-[#a492c9] mt-1">Provide your current password to verify your identity.</p>
      </div>

      <div className="h-px bg-[#2f2348] w-full max-w-[600px]" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[600px]">
        <div className="flex flex-col gap-2">
          <label className="text-white text-sm font-semibold leading-normal">New Password</label>
          <div className="flex w-full items-stretch rounded-lg shadow-sm border border-[#443267] bg-[#221933] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/50 input-with-toggle">
            <input
              className="form-input flex-1 resize-none overflow-hidden rounded-l-lg text-white focus:outline-0 bg-transparent h-12 placeholder:text-[#a492c9]/50 px-4 text-sm font-normal leading-normal"
              placeholder="Enter new password"
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              aria-label="New password"
            />
            <button type="button" onClick={() => setShowNew(v => !v)} className="text-[#a492c9] flex bg-transparent items-center justify-center px-3 rounded-r-lg cursor-pointer hover:text-white transition-colors focus:outline-none focus-visible:ring-0" style={{outline: 'none'}}>
              <span className="material-symbols-outlined text-[20px]">{showNew ? 'visibility' : 'visibility_off'}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-white text-sm font-semibold leading-normal">Confirm New Password</label>
          <div className="flex w-full items-stretch rounded-lg shadow-sm border border-[#443267] bg-[#221933] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/50 input-with-toggle">
            <input
              className="form-input flex-1 resize-none overflow-hidden rounded-l-lg text-white focus:outline-0 bg-transparent h-12 placeholder:text-[#a492c9]/50 px-4 text-sm font-normal leading-normal"
              placeholder="Re-enter new password"
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              aria-label="Confirm new password"
            />
<button type="button" onClick={() => setShowConfirm(v => !v)} className="text-[#a492c9] flex bg-transparent items-center justify-center px-3 rounded-r-lg cursor-pointer hover:text-white transition-colors focus:outline-none focus-visible:ring-0" style={{outline: 'none'}}>
              <span className="material-symbols-outlined text-[20px]">{showConfirm ? 'visibility' : 'visibility_off'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#221933] border border-[#443267] rounded-lg p-5 max-w-[600px]">
        <h4 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">verified_user</span>
          Password Requirements
        </h4>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
          <li className={`flex items-center gap-2 text-[#a492c9] text-xs ${requirements.length ? 'text-white' : ''}`}>
            <span className={`material-symbols-outlined text-[16px] ${requirements.length ? 'text-green-500' : 'text-[#a492c9]'}`}>{requirements.length ? 'check_circle' : 'circle'}</span>
            Minimum 8 characters
          </li>
          <li className={`flex items-center gap-2 text-[#a492c9] text-xs ${requirements.uppercase ? 'text-white' : ''}`}>
            <span className={`material-symbols-outlined text-[16px] ${requirements.uppercase ? 'text-green-500' : 'text-[#a492c9]'}`}>{requirements.uppercase ? 'check_circle' : 'circle'}</span>
            At least one uppercase letter
          </li>
          <li className={`flex items-center gap-2 text-[#a492c9] text-xs ${requirements.number ? 'text-white' : ''}`}>
            <span className={`material-symbols-outlined text-[16px] ${requirements.number ? 'text-green-500' : 'text-[#a492c9]'}`}>{requirements.number ? 'check_circle' : 'circle'}</span>
            At least one number
          </li>
          <li className={`flex items-center gap-2 text-[#a492c9] text-xs ${requirements.special ? 'text-white' : ''}`}>
            <span className={`material-symbols-outlined text-[16px] ${requirements.special ? 'text-green-500' : 'text-[#a492c9]'}`}>{requirements.special ? 'check_circle' : 'circle'}</span>
            At least one special character
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <Button variant="purple" size="lg" type="submit" className="min-w-[140px]" disabled={!allOk}>Update Password</Button>
        <button className="flex min-w-[80px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-transparent hover:bg-[#221933] border border-transparent hover:border-[#2f2348] transition-all text-[#a492c9] hover:text-white text-base font-medium leading-normal" type="button" onClick={() => { setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); }}>Cancel</button>
      </div>
    </form>
  );
}
