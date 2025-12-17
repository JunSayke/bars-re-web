"use client";
import React from "react";
import Icon from "@/components/atoms/Icon";
import Avatar from "@/components/atoms/Avatar";


export const HeaderWorkspace: React.FC = () => {
  return (
    <div className="h-16 border-b border-[#22303a] flex items-center justify-between px-6 bg-background-dark shrink-0">
      <div className="flex items-center gap-3 flex-1">
        <div className="flex items-center gap-3">
          <div className="text-primary">
            <span className="material-symbols-outlined text-[28px]">graphic_eq</span>
          </div>
          <h1 className="text-lg font-semibold tracking-tight">Bisaya AI Rap System</h1>
        </div>

        <div className="h-6 w-px bg-[#233648] mx-4" />

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm bg-[#0f1720] px-2 py-1 rounded text-slate-400 border border-[#233648]">
            <Icon name="timer" size={16} />
            <input className="bg-transparent text-slate-200 border-none rounded h-5 w-12 text-center text-sm p-0 focus:ring-0" placeholder="BPM" type="number" defaultValue={120} />
            <span className="text-xs font-medium text-slate-500">BPM</span>
          </div>

          <div className="flex items-center gap-3 ml-2">
            <button className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-primary transition-colors bg-[#0f1720] border border-[#233648] px-2 py-1 rounded" title="Toggle Timestamps">
              <Icon name="schedule" size={14} />
              <span>Time</span>
            </button>
            <button className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded" title="Toggle Syllable Count">
              <Icon name="numbers" size={14} />
              <span>Syl</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#0f1720] border border-[#233648] text-slate-300">
            <span className="w-2 h-2 rounded-full bg-green-400 mr-2" />
            <span className="text-xs">System Online</span>
          </div>


        </div>

        <div className="hidden lg:flex items-center gap-3">
          <button className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-[#0f1720] border border-[#233648] text-slate-300" title="Settings">
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
        </div>

        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shadow-sm">JS</div>
      </div>
    </div>
  );
};

export default HeaderWorkspace;
