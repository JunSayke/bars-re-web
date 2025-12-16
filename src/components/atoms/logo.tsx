import React from "react";

export const Logo: React.FC<{ size?: number }> = ({ size = 36 }) => {
  return (
    <div className="flex items-center gap-3" aria-hidden>
      <div className="flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark shadow-lg text-white" style={{ width: size, height: size }}>
        <span className="material-symbols-outlined text-[18px]">graphic_eq</span>
      </div>
      <h2 className="text-lg font-semibold tracking-tight text-white">Bisaya AI Rap</h2>
    </div>
  );
};

export default Logo;

