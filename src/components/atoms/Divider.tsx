import React from "react";

export const Divider: React.FC<{ text?: string }> = ({ text }) => {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-slate-800/40"></span>
      </div>
      <div className="relative flex justify-center text-xs uppercase tracking-wider font-semibold">
        <span className="bg-[#0e0713] px-4 text-slate-400/70">{text}</span>
      </div>
    </div>
  );
};

export default Divider;
