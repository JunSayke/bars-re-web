"use client";
import React from "react";
import Icon from "@/components/atoms/Icon";

type PlayerControlsProps = {
  current?: string;
  total?: string;
};

export const PlayerControls: React.FC<PlayerControlsProps> = ({ current = "0:00", total = "0:00" }) => {
  return (
    <div className="flex items-center bg-[#0f1720] border border-[#233648] rounded-full p-1 shadow-sm">
      <div className="flex items-center gap-1 px-1">
        <button className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-[#233648] transition-colors" title="Stop">
          <Icon name="stop" size={18} />
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white hover:bg-blue-600 shadow-sm transition-colors mx-0.5" title="Play">
          <Icon name="play_arrow" size={22} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-[#233648] transition-colors" title="Pause">
          <Icon name="pause" size={18} />
        </button>
      </div>

      <div className="w-px h-4 bg-[#233648] mx-2" />

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono font-medium text-slate-400 select-none w-8 text-right">{current}</span>
        <div className="w-20 md:w-32 h-1 bg-[#111a22] rounded-full relative group cursor-pointer">
          <div className="absolute inset-y-0 left-0 w-[30%] bg-primary rounded-full group-hover:bg-blue-400 transition-colors" />
        </div>
        <span className="text-[10px] font-mono font-medium text-slate-400 select-none w-8">{total}</span>
      </div>

      <div className="w-px h-4 bg-[#233648] mx-2" />

      <div className="flex items-center pr-2">
        <button className="text-slate-400 hover:text-primary transition-colors" title="Volume">
          <Icon name="volume_up" size={18} />
        </button>
      </div>
    </div>
  );
};

export default PlayerControls;
