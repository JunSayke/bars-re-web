"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  children: React.ReactNode;
  containerId?: string;
};

export default function Portal({ children, containerId = "sheets-portal" }: Props) {
  const [mountEl, setMountEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let el = document.getElementById(containerId);
    let created = false;
    if (!el) {
      el = document.createElement("div");
      el.id = containerId;
      document.body.appendChild(el);
      created = true;
    }
    // manage a global refcount so multiple portals don't remove the container prematurely
    const key = `__portal_count_${containerId}`;
    // @ts-ignore
    if (!window[key]) window[key] = 0;
    // @ts-ignore
    window[key] += 1;

    setMountEl(el);

    return () => {
      // @ts-ignore
      window[key] -= 1;
      // remove the container only if we created it and no other portals remain
      // @ts-ignore
      if (created && el && el.parentNode && window[key] <= 0) el.parentNode.removeChild(el);
    };
  }, [containerId]);

  if (!mountEl) return null;
  return createPortal(children, mountEl);
}
