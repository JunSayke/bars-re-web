"use client";
import React, { useState } from "react";
import Link from "next/link";
import Label from "../atoms/Label";
import Input from "../atoms/Input";
import Icon from "../atoms/Icon";
import IconButton from "../atoms/IconButton";

export const PasswordField: React.FC<{ id: string; label?: string; placeholder?: string; showForgot?: boolean; autoComplete?: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ id, label = "Password", placeholder = "Enter your password", showForgot = true, autoComplete = "current-password", value, onChange }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label htmlFor={id}>{label}</Label>
        {showForgot && (
          <Link href="/forgot" className="text-sm font-medium text-primary dark:text-primary hover:text-primary/80 hover:underline !text-primary" style={{color: '#5b13ec'}}>Forgot Password?</Link>
        )}
      </div>
      <Input id={id} name={id} value={value} onChange={onChange} type={visible ? "text" : "password"} placeholder={placeholder} leading={<Icon name="lock" size={18} />} trailing={<IconButton label={visible ? "Hide password" : "Show password"} type="button" onClick={() => setVisible(v => !v)} className="text-[#a492c9] dark:text-[#a492c9] hover:bg-transparent focus:outline-none" size={36} variant="ghost"><Icon name={visible ? "visibility" : "visibility_off"} size={18} /></IconButton>} autoComplete={autoComplete} />
    </div>
  );
};

export default PasswordField;
