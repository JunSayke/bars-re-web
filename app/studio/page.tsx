import LyricEditor from "../../src/components/organisms/LyricEditor";

export default function StudioPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-start justify-center p-4 lg:p-6 overflow-hidden font-display">
      <div className="flex gap-6 w-full max-w-[1200px] h-[calc(100vh-3rem)]">
        <LyricEditor />
      </div>
    </div>
  );
}
