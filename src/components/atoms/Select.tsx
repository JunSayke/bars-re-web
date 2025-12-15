import React from "react";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: { value: string; label: string }[];
};

export const Select: React.FC<SelectProps> = ({ options, className = "", ...props }) => {
  return (
    <div className={className}>
      <select
        className="appearance-none bg-surface-lighter/50 hover:bg-surface-lighter text-[#d8b4fe] text-xs font-bold uppercase tracking-wider pl-3 pr-8 py-1.5 rounded-lg border border-primary/30 outline-none cursor-pointer transition-colors"
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
