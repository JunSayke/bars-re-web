import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  inputClassName?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ leading, trailing, className = "", inputClassName = "", ...props }, ref) => {
  const inputBase = "w-full rounded-lg border border-[#2a2130] bg-[#0f0b14] pl-10 pr-3 py-3 text-sm text-slate-200 placeholder:text-slate-500 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";
  return (
    <div className={`relative ${className}`}>
      {leading ? <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400/70">{leading}</div> : null}
      <input
        ref={ref}
        className={`${inputBase} ${inputClassName}`}
        {...props}
        aria-invalid={props['aria-invalid'] ?? false}
      />
      {trailing ? <div className="absolute right-3 top-1/2 -translate-y-1/2">{trailing}</div> : null}
    </div>
  );
});

export default Input;
