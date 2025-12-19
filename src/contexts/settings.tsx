"use client";
import React, { createContext, useContext, useState } from "react";

type Settings = {
  showTimestamps: boolean;
  showSyllables: boolean;
  setShowTimestamps: (v: boolean) => void;
  setShowSyllables: (v: boolean) => void;
};

const SettingsContext = createContext<Settings | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [showSyllables, setShowSyllables] = useState(true);

  return (
    <SettingsContext.Provider value={{ showTimestamps, showSyllables, setShowTimestamps, setShowSyllables }}>
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
