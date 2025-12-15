import React from "react";
import { Input } from "../atoms/Input";

type LyricLineProps = {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
};

export const LyricLine: React.FC<LyricLineProps> = ({ value, onChange, placeholder = "Write lyrics", className = "" }) => {
  return (
    <div className={`relative flex gap-4 p-3 pr-4 rounded-xl transition-all group/line ${className}`}>
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-transparent"
          inputClassName={`w-full bg-transparent text-white text-lg font-medium border-none focus:ring-0 p-0 placeholder-white/10 tracking-tight`}
        />
      </div>
    </div>
  );
};

export default LyricLine;
