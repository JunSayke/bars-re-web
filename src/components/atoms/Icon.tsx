import React from "react";

type IconProps = React.HTMLAttributes<HTMLSpanElement> & {
  name: string;
  size?: number | string;
};

export const Icon: React.FC<IconProps> = ({ name, size = 20, className = "", ...props }) => {
  return (
    <span
      className={`material-symbols-outlined align-middle ${className}`}
      style={{ fontSize: size }}
      aria-hidden
      {...props}
    >
      {name}
    </span>
  );
};

export default Icon;
