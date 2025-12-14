import React from "react";

export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ children, className = "", ...props }) => {
  return (
    <label className={`block text-sm font-medium leading-none text-slate-300/80 ${className}`} {...props}>
      {children}
    </label>
  );
};

export default Label;
