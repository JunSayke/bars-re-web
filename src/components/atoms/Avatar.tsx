import React from "react";

type AvatarProps = {
  name?: string;
  size?: number;
  src?: string;
  className?: string;
};

export const Avatar: React.FC<AvatarProps> = ({ name = "User", size = 32, src, className = "" }) => {
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold ${className}`}
      style={{ width: size, height: size }}
      title={name}
    >
      {src ? <img src={src} alt={name} className="w-full h-full rounded-full object-cover" /> : initials}
    </div>
  );
};

export default Avatar;
