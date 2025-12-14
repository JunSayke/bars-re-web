import React from "react";
import Button from "../atoms/Button";

export const SocialButton: React.FC<{ provider?: string; icon?: React.ReactNode }> = ({ provider = "Google", icon, ...props }) => {
  const defaultIcon = (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M9 3.48c1.69 0 2.88.73 3.55 1.34l2.58-2.5C13.89.9 11.64 0 9 0 5.48 0 2.46 1.9.9 4.7l2.95 2.29C4.3 5.01 6.43 3.48 9 3.48z" fill="#EA4335"/>
      <path d="M17.64 9.2c0-.63-.06-1.24-.18-1.83H9v3.48h4.84c-.21 1.14-.85 2.1-1.82 2.75l2.95 2.29c1.72-1.59 2.67-3.95 2.67-6.69z" fill="#34A853"/>
      <path d="M3.85 10.52A5.4 5.4 0 0 1 3.6 9c0-.62.11-1.2.25-1.76L.9 4.95A8.99 8.99 0 0 0 0 9c0 1.44.34 2.79.95 3.98l2.9-2.46z" fill="#FBBC05"/>
      <path d="M9 18c2.43 0 4.47-.8 5.96-2.17l-2.95-2.29C11.42 13.57 10.3 14 9 14c-2.57 0-4.7-1.52-5.45-3.71L.9 12.9C2.46 15.7 5.48 18 9 18z" fill="#4285F4"/>
    </svg>
  );

  return (
    <Button variant="outline" className="w-full flex items-center justify-center gap-2.5 bg-[#0f0713] border border-[#2a2130] text-slate-200 py-3 hover:border-primary hover:text-primary" {...props}>
      <span className="mr-2">{icon ?? defaultIcon}</span>
      <span className="text-sm font-medium">{provider}</span>
    </Button>
  );
};

export default SocialButton;
