"use client";
import React from "react";
import Icon from "@/components/atoms/Icon";

export const FloatingPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = React.useState(false);

  const togglePlay = () => setIsPlaying((s) => !s);

  const onUpload = () => {
    // TODO: implement upload handler
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "audio/*";
    input.onchange = () => console.log("uploaded", input.files?.[0]);
    input.click();
  };

  return (
    <div className="fixed left-0 right-0 bottom-6 flex items-center justify-center z-50 pointer-events-none">
      <div className="pointer-events-auto w-[min(900px,90%)] bg-[#0b1116]/80 border border-[#233648] backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-4 shadow-2xl">
        <div className="flex items-center gap-2">
          <button onClick={onUpload} className="hidden sm:inline-flex items-center gap-2 text-sm text-slate-300 bg-[#0f1720] px-3 py-1 rounded-full border border-[#233648] hover:bg-[#172029] transition-colors">
            <Icon name="upload_file" size={16} />
            <span>Upload Beat</span>
          </button>

          <button onClick={togglePlay} aria-pressed={isPlaying} className="w-9 h-9 flex items-center justify-center rounded-full bg-primary text-white hover:bg-blue-600 transition-colors">
            <Icon name={isPlaying ? "pause" : "play_arrow"} size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3 flex-1">
          <span className="text-[10px] font-mono text-slate-400">0:12</span>
          <div className="flex-1 h-2 rounded-full bg-slate-900/40 relative">
            <div className="absolute inset-y-0 left-0 w-[20%] bg-primary rounded-full" />
          </div>
          <span className="text-[10px] font-mono text-slate-400">3:45</span>
        </div>

        <div className="flex items-center gap-3">
          <button className="text-slate-400 hover:text-white transition-colors">
            <Icon name="volume_up" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatingPlayer;
