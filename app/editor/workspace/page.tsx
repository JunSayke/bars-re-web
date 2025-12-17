import React from "react";
import LeftRail from "@/components/organisms/LeftRail";
import RightRail from "@/components/organisms/RightRail";
import HeaderWorkspace from "@/components/organisms/HeaderWorkspace";
import WorkspaceEditor from "@/components/organisms/WorkspaceEditor";
import FloatingPlayer from "@/components/organisms/FloatingPlayer";

export const metadata = {
  title: "Workspace - Bisaya AI Rap System",
};

export default function EditorWorkspacePage() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white h-screen overflow-hidden flex flex-col font-display">
      <HeaderWorkspace />

      <main className="flex-1 flex overflow-hidden relative">
        <React.Suspense fallback={<div className="w-16" />}>
          <LeftRail />
        </React.Suspense>

        <section className="flex-1 flex flex-col relative min-w-0">
          <div className="flex-1 overflow-y-auto relative p-6 md:px-12 lg:px-24 flex justify-center bg-background-light dark:bg-background-dark">
            <WorkspaceEditor />
          </div>
        </section>

        <React.Suspense fallback={<div className="w-16" />}>
          <RightRail />
        </React.Suspense>
      </main>

      {/* Floating player overlay */}
      <FloatingPlayer />

    </div>
  );
}
