"use client";

import React from "react";

type Props = { label: string; color?: "primary" | "secondary" };

export default function RhymeBadge({ label, color = "primary" }: Props) {
  const bg = color === "primary" ? "bg-primary/10 border-primary/20 text-primary-300" : "bg-secondary/10 border-secondary/20 text-secondary";
  return (
    <div className={`flex items-center justify-center w-6 h-6 rounded ${bg} text-[10px] font-bold uppercase cursor-pointer hover:opacity-90 transition-colors`}>
      {label}
    </div>
  );
}
