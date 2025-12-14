"use client";
import React, { useState } from "react";
import Link from "next/link";
import Label from "../atoms/Label";
import Input from "../atoms/Input";
import Icon from "../atoms/Icon";

export const PasswordField: React.FC<{ id: string; label?: string; placeholder?: string; showForgot?: boolean }> = ({ id, label = "Password", placeholder = "Enter your password", showForgot = true }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label htmlFor={id}>{label}</Label>
        {showForgot && (
          <Link href="/forgot" className="text-sm font-medium text-primary dark:text-primary hover:text-primary/80 hover:underline !text-primary" style={{color: '#5b13ec'}}>Forgot Password?</Link>
        )}
      </div>
      <Input id={id} name={id} type={visible ? "text" : "password"} placeholder={placeholder} leading={<Icon name="lock" size={18} />} trailing={<button aria-label={visible ? "Hide password" : "Show password"} type="button" onClick={() => setVisible(v => !v)} className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-[#a492c9] dark:hover:bg-[#2f2348] dark:hover:text-white transition-colors cursor-pointer"> <Icon name="visibility" size={18} /> </button>} autoComplete="current-password" />
    </div>
  );
};

export default PasswordField;
