"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { workspaceKeys } from "../../hooks/queryKeys";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useGetBeatLinkQuery } from "../../hooks/useGetBeatLinkQuery";
import { useUpsertBeatLinkMutation } from "../../hooks/useUpsertBeatLinkMutation";
import { useBeatLibraryQuery } from "../../hooks/useBeatLibraryQuery";
import { useDeleteBeatLibraryItemMutation } from "../../hooks/useDeleteBeatLibraryItemMutation";
import { useRenameBeatLibraryItemMutation } from "../../hooks/useRenameBeatLibraryItemMutation";
import { BeatLinkForm } from "../molecules/BeatLinkForm";
import { SpotifyEmbedPlayer } from "../molecules/SpotifyEmbedPlayer";
import { YouTubeEmbedPlayer } from "../molecules/YouTubeEmbedPlayer";
import { SoundCloudEmbedPlayer } from "../molecules/SoundCloudEmbedPlayer";
import type { BeatLink } from "../../schemas/workspace.schema";
import { usePanelDrag } from "../../lib/usePanelDrag";
import type { BeatLibraryItem } from "../../services/beat-library.service";
import { getBeatPlaybackPayload } from "../../services/beat-library.service";
import { supabase } from "@/shared/config/supabase";

const INITIAL_WIDTH = 460;
const INITIAL_HEIGHT = 620;
const MIN_WIDTH = 340;
const MIN_HEIGHT = 460;
const MAX_TAGS_LENGTH = 200;
const MAX_LYRICS_LENGTH = 2000;
const ACCEPTED_TYPES = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/x-wav"];
const ACCEPTED_EXTENSIONS = [".mp3", ".wav", ".ogg"];
const MAX_SIZE_BYTES = 20 * 1024 * 1024;
const TABS = [
  { id: "generation", label: "Generation" },
  { id: "links", label: "Beat Links" },
  { id: "recent", label: "Audios" },
] as const;

type ResizeDir = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw";
type TabId = (typeof TABS)[number]["id"];

function getInitialPos(w: number, h: number) {
  if (typeof window === "undefined") return { x: 0, y: 0 };
  return {
    x: Math.max(0, window.innerWidth - w - 24),
    y: Math.max(0, window.innerHeight - h - 120),
  };
}

interface BeatLibraryPanelProps {
  sessionId: string;
  onLoadBeat: (
    url: string,
    metadata: { fileName: string; bpm: number | null },
  ) => void;
  onUploadBeatFile: (file: File) => void;
  onClose: () => void;
  onActivate: () => void;
  zIndex: number;
}

function renderEmbedPlayer(beatLink: BeatLink) {
  switch (beatLink.provider) {
    case "youtube":
      return <YouTubeEmbedPlayer url={beatLink.url} />;
    case "soundcloud":
      return <SoundCloudEmbedPlayer url={beatLink.url} />;
    default:
      return <SpotifyEmbedPlayer url={beatLink.url} />;
  }
}

function sourceBadgeVariant(sourceTag: BeatLibraryItem["sourceTag"]) {
  if (sourceTag === "generated") return "default";
  if (sourceTag === "uploaded") return "secondary";
  return "outline";
}

function labelFromStoragePath(storagePath?: string) {
  if (!storagePath) return "Unknown file";
  const parts = storagePath.split("/");
  return parts[parts.length - 1] ?? storagePath;
}

export function BeatLibraryPanel({
  sessionId,
  onLoadBeat,
  onUploadBeatFile,
  onClose,
  onActivate,
  zIndex,
}: BeatLibraryPanelProps) {
  const [pos, setPos] = useState(() =>
    getInitialPos(INITIAL_WIDTH, INITIAL_HEIGHT),
  );
  const [panelSize, setPanelSize] = useState({
    w: INITIAL_WIDTH,
    h: INITIAL_HEIGHT,
  });
  const [activeTab, setActiveTab] = useState<TabId>("generation");

  const [engineOnline, setEngineOnline] = useState(false);
  const [engineMessage, setEngineMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTracks, setGeneratedTracks] = useState<string[]>([]);
  const [generationInfo, setGenerationInfo] = useState<string>("");
  const [musicTags, setMusicTags] = useState("");
  const [bpm, setBpm] = useState(120);
  const [beatSignature, setBeatSignature] = useState("4/4");
  const [instrumentalOnly, setInstrumentalOnly] = useState(false);
  const [lyrics, setLyrics] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(1.5);
  const [replacingBeatLink, setReplacingBeatLink] = useState(false);
  const [loadingBeatId, setLoadingBeatId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BeatLibraryItem | null>(
    null,
  );
  const [loadedBeatId, setLoadedBeatId] = useState<string | null>(null);
  const [editingBeatId, setEditingBeatId] = useState<string | null>(null);
  const [editingBeatName, setEditingBeatName] = useState("");
  const [embeddedBeatLink, setEmbeddedBeatLink] = useState<BeatLink | null>(
    null,
  );

  const { beatLink, isLoading: isBeatLinkLoading } =
    useGetBeatLinkQuery(sessionId);
  const { beats: recentBeats, isLoading: isRecentBeatsLoading } =
    useBeatLibraryQuery(30);
  const upsertBeatLinkMutation = useUpsertBeatLinkMutation();
  const deleteBeatMutation = useDeleteBeatLibraryItemMutation();
  const renameBeatMutation = useRenameBeatLibraryItemMutation();
  const queryClient = useQueryClient();

  const resizeState = useRef<{
    startX: number;
    startY: number;
    originW: number;
    originH: number;
    originX: number;
    originY: number;
    dir: ResizeDir;
  } | null>(null);

  // Use dedicated drag handle instead of capturing pointer on panel root
  const dragHandlers = usePanelDrag(pos, panelSize, setPos);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  // Check engine status on mount via server action (avoids exposing Gradio host/credentials)
  // Use useEffect for side-effects (previous code used useState incorrectly).
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { checkGradioHealthAction } =
          await import("../../actions/check-gradio-health.action");
        const res = await checkGradioHealthAction();
        if (mounted) {
          setEngineOnline(Boolean(res?.ok));
          setEngineMessage(res?.message ?? null);
        }
      } catch (err) {
        // ignore, remains false
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const tagsRemaining = MAX_TAGS_LENGTH - musicTags.length;
  const lyricsRemaining = MAX_LYRICS_LENGTH - lyrics.length;
  // Show the beat link form when the user explicitly requested replace OR
  // when there is no stored beatLink and no embeddedBeatLink loaded from recents.
  const showBeatLinkForm =
    replacingBeatLink || (!beatLink && !embeddedBeatLink);

  const durationSeconds = useMemo(
    () => Math.round(durationMinutes * 60),
    [durationMinutes],
  );

  function handleBeatLinkSubmit(url: string) {
    upsertBeatLinkMutation.mutate(
      { sessionId, url },
      { onSuccess: () => setReplacingBeatLink(false) },
    );
  }

  async function handleGenerateBeat() {
    setIsGenerating(true);
    setGeneratedTracks([]);
    setGenerationInfo("");
    try {
      const { generateMusicAction } =
        await import("../../actions/generate-music.action");
      const res = await generateMusicAction(sessionId, {
        tags: musicTags || "drill, dark",
        lyrics: lyrics || "",
        dur: Math.round(durationMinutes * 60),
        lang: "🇮🇩 Indonesian", // Accent similar to cebuano
        ntracks: 1,
        think: true,
        seed: -1,
        bpm: bpm ?? 0,
        key: "",
        ts: beatSignature ?? "",
        steps: 30,
        guide: 8,
        instrumental: instrumentalOnly,
      });

      const tracks = (res?.created ?? [])
        .map((c: any) => c.signedUrl)
        .filter(Boolean);
      setGeneratedTracks(tracks);
      setGenerationInfo(res?.info ?? "");
      // Invalidate recent beat library so the generated track appears in the list
      try {
        void queryClient.invalidateQueries({
          queryKey: workspaceKeys.beatLibrary(),
        });
        void queryClient.invalidateQueries({
          queryKey: workspaceKeys.session(sessionId),
        });
        void queryClient.invalidateQueries({
          queryKey: workspaceKeys.beatLink(sessionId),
        });
      } catch (e) {
        // ignore
      }
    } catch (err) {
      console.error("Generation failed (server)", err);
      setGenerationInfo(
        "Generation failed: " +
          (err instanceof Error ? err.message : String(err)),
      );
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleLoadRecentLink(item: BeatLibraryItem) {
    if (item.kind !== "link") return;
    try {
      // Fetch the beat_link row by id and embed it in the links tab
      const { data, error } = await supabase
        .from("beat_links")
        .select("*")
        .eq("id", item.recordId)
        .single();
      if (error) throw error;
      if (!data) throw new Error("Beat link not found");
      const link: BeatLink = {
        id: data.id,
        sessionId: sessionId,
        url: data.url,
        provider: data.provider,
        bpm: data.bpm,
      };
      setEmbeddedBeatLink(link);
      setReplacingBeatLink(false);
      setActiveTab("links");
    } catch (e) {
      console.warn("Failed to load recent beat link:", (e as Error).message);
      toast.error("Failed to load beat link");
    }
  }

  async function handleLoadBeat(item: BeatLibraryItem) {
    if (item.kind !== "file") return;
    try {
      setLoadingBeatId(item.id);
      const playback = await getBeatPlaybackPayload(item.recordId);
      if (!playback.url) throw new Error("Unable to load beat URL");
      onLoadBeat(playback.url, {
        fileName: playback.fileName,
        bpm: playback.bpm,
      });
      // Also update the session metadata to reference this beat file id
      try {
        const { data: sessionRow } = await supabase
          .from("sessions")
          .select("metadata")
          .eq("id", sessionId)
          .single();

        const newMetadata = Object.assign(
          {},
          (sessionRow?.metadata as any) ?? {},
          { beat_file_id: item.recordId },
        );
        await supabase
          .from("sessions")
          .update({ metadata: newMetadata })
          .eq("id", sessionId);
      } catch (metaErr) {
        console.warn(
          "Failed to update session metadata when loading beat:",
          (metaErr as Error).message,
        );
      }
      setLoadedBeatId(item.id);
      toast.success("Beat loaded into player");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load beat";
      toast.error(message);
    } finally {
      setLoadingBeatId(null);
    }
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    deleteBeatMutation.mutate(deleteTarget, {
      onSuccess: () => {
        toast.success("Beat removed from library");
        setDeleteTarget(null);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete beat");
      },
    });
  }

  function handleUploadFromRecents() {
    uploadInputRef.current?.click();
  }

  function handleRecentUploadChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error(
        "Unsupported file format. Please upload an MP3, WAV, or OGG file.",
      );
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      toast.error("File is too large. Maximum allowed size is 20 MB.");
      return;
    }

    onUploadBeatFile(file);
    toast.success("Uploading beat...");
    setActiveTab("generation");
  }

  function startEditingBeat(item: BeatLibraryItem) {
    setEditingBeatId(item.id);
    setEditingBeatName(item.beatName);
  }

  function cancelEditingBeat() {
    setEditingBeatId(null);
    setEditingBeatName("");
  }

  function saveBeatName(item: BeatLibraryItem) {
    const nextName = editingBeatName.trim();
    if (!nextName) {
      toast.error("Beat name cannot be empty");
      return;
    }
    renameBeatMutation.mutate(
      {
        kind: item.kind,
        recordId: item.recordId,
        sessionId: item.sessionId,
        beatName: nextName,
      },
      {
        onSuccess: () => {
          toast.success("Beat name updated");
          cancelEditingBeat();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update beat name");
        },
      },
    );
  }

  // Panel-level pointer handlers removed; use the header handle to drag instead

  function onResizePointerDown(
    e: React.PointerEvent<HTMLDivElement>,
    dir: ResizeDir,
  ) {
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {
      // ignore
    }
    resizeState.current = {
      startX: e.clientX,
      startY: e.clientY,
      originW: panelSize.w,
      originH: panelSize.h,
      originX: pos.x,
      originY: pos.y,
      dir,
    };
  }

  function onResizePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!resizeState.current) return;
    const { startX, startY, originW, originH, originX, originY, dir } =
      resizeState.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    let newW = originW;
    let newH = originH;
    let newX = originX;
    let newY = originY;

    if (dir.includes("e")) newW = Math.max(MIN_WIDTH, originW + dx);
    if (dir.includes("w")) {
      newW = Math.max(MIN_WIDTH, originW - dx);
      newX = originX + (originW - newW);
    }
    if (dir.includes("s")) newH = Math.max(MIN_HEIGHT, originH + dy);
    if (dir.includes("n")) {
      newH = Math.max(MIN_HEIGHT, originH - dy);
      newY = originY + (originH - newH);
    }

    setPanelSize({ w: newW, h: newH });
    setPos({ x: newX, y: newY });
  }

  function onResizePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {
      // ignore
    }
    resizeState.current = null;
  }

  function onResizePointerCancel(e: React.PointerEvent<HTMLDivElement>) {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {
      // ignore
    }
    resizeState.current = null;
  }

  const panelStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: panelSize.w,
    height: panelSize.h,
    transform: `translate(${pos.x}px, ${pos.y}px)`,
    zIndex,
  };

  return (
    <div
      style={panelStyle}
      onPointerDownCapture={onActivate}
      className="flex flex-col rounded-lg border border-border bg-card shadow-xl overflow-hidden"
    >
      <div className="flex items-center justify-between px-3 py-2 bg-secondary select-none flex-shrink-0">
        <div
          // Drag handle — intentionally small and unobtrusive. All drag logic is
          // bound to this element via usePanelDrag so interactive children inside
          // the panel aren't interfered with.
          className="mr-2 w-6 h-6 cursor-grab active:cursor-grabbing flex items-center justify-center"
          role="button"
          tabIndex={0}
          aria-label="Move panel"
          {...dragHandlers}
          style={{ touchAction: "none" }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path
              d="M10 6h2v2h-2zM6 6h2v2H6zM14 6h2v2h-2zM18 6h2v2h-2zM10 10h2v2h-2zM6 10h2v2H6z"
              fill="currentColor"
            />
          </svg>
        </div>
        <span className="text-xs font-semibold uppercase tracking-widest text-foreground">
          Beat Library
        </span>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground text-sm leading-none cursor-pointer"
          onClick={onClose}
          aria-label="Close panel"
        >
          ×
        </button>
      </div>

      <div
        className="flex-1 overflow-y-auto p-3 cursor-default"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <input
          ref={uploadInputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(",")}
          className="hidden"
          onChange={handleRecentUploadChange}
          aria-label="Upload beat from recents"
        />

        <div className="space-y-4" style={{ fontFamily: "var(--font-sans)" }}>
          <div className="flex w-full overflow-x-auto border-b border-border/60">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap border-b-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:border-muted hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className={activeTab !== "generation" ? "hidden" : "space-y-4"}>
            <div className="flex items-center justify-between gap-3 rounded-md border border-border/60 bg-muted/20 px-3 py-2">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Engine status
              </p>
              <div className="inline-flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-2"
                  onClick={async () => {
                    try {
                      const { checkGradioHealthAction } =
                        await import("../../actions/check-gradio-health.action");
                      const res = await checkGradioHealthAction();
                      setEngineOnline(Boolean(res?.ok));
                      setEngineMessage(res?.message ?? null);
                    } catch (err) {
                      setEngineOnline(false);
                      setEngineMessage((err as Error)?.message ?? String(err));
                    }
                  }}
                  aria-label="Re-check engine status"
                >
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${engineOnline ? "bg-emerald-500" : "bg-red-500"}`}
                  />
                  <span className="text-xs font-semibold text-foreground">
                    {engineOnline ? "Online" : "Offline"}
                  </span>
                </button>
                <button
                  type="button"
                  className="text-xs underline text-muted-foreground ml-2"
                  onClick={async () => {
                    try {
                      const { checkGradioHealthAction } =
                        await import("../../actions/check-gradio-health.action");
                      const res = await checkGradioHealthAction();
                      setEngineOnline(Boolean(res?.ok));
                      setEngineMessage(res?.message ?? null);
                      toast.info(
                        res?.ok
                          ? "Engine reachable"
                          : `Engine check: ${res?.message ?? "unreachable"}`,
                      );
                    } catch (err) {
                      toast.error("Engine check failed");
                    }
                  }}
                >
                  Re-check
                </button>
              </div>
              {engineMessage ? (
                <p className="text-[11px] text-muted-foreground mt-1">
                  {engineMessage}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="beat-style-tags"
                  className="text-xs font-semibold text-foreground uppercase tracking-wide"
                >
                  Music style / tags
                </label>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">
                    Max 100 chars
                  </Badge>
                  <Badge
                    variant={tagsRemaining < 0 ? "destructive" : "secondary"}
                    className="text-[10px]"
                  >
                    {Math.max(tagsRemaining, 0)} left
                  </Badge>
                </div>
              </div>
              <input
                id="beat-style-tags"
                value={musicTags}
                onChange={(e) =>
                  setMusicTags(e.target.value.slice(0, MAX_TAGS_LENGTH))
                }
                placeholder="boom bap, gritty, warm vinyl, punchy snare"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="beat-bpm"
                  className="text-xs font-semibold text-foreground uppercase tracking-wide"
                >
                  BPM (90-200)
                </label>
                <input
                  id="beat-bpm"
                  type="number"
                  min={90}
                  max={200}
                  value={bpm}
                  onChange={(e) => {
                    const next = Number(e.target.value);
                    if (!Number.isFinite(next)) return;
                    // Allow direct editing without clamping on each keystroke;
                    // enforce integer value but keep clamping for final validation elsewhere.
                    setBpm(Math.round(next));
                  }}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="beat-signature"
                  className="text-xs font-semibold text-foreground uppercase tracking-wide"
                >
                  Beat signature
                </label>
                <select
                  id="beat-signature"
                  value={beatSignature}
                  onChange={(e) => setBeatSignature(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="4/4">4/4</option>
                  <option value="3/4">3/4</option>
                  <option value="6/8">6/8</option>
                  <option value="7/8">7/8</option>
                </select>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={instrumentalOnly}
                onChange={(e) => setInstrumentalOnly(e.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              Instrumental only
            </label>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="beat-lyrics"
                  className="text-xs font-semibold text-foreground uppercase tracking-wide"
                >
                  Lyrics
                </label>
                <Badge
                  variant={lyricsRemaining < 0 ? "destructive" : "secondary"}
                  className="text-[10px]"
                >
                  {Math.max(lyricsRemaining, 0)} left
                </Badge>
              </div>
              <textarea
                id="beat-lyrics"
                value={lyrics}
                onChange={(e) =>
                  setLyrics(e.target.value.slice(0, MAX_LYRICS_LENGTH))
                }
                rows={7}
                placeholder={
                  instrumentalOnly
                    ? "Instrumental mode enabled. Lyrics are optional."
                    : "Enter lyrics up to 2000 characters"
                }
                className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="beat-duration"
                  className="text-xs font-semibold text-foreground uppercase tracking-wide"
                >
                  Beat duration
                </label>
                <Badge variant="outline" className="text-[10px]">
                  {durationSeconds}s
                </Badge>
              </div>
              <input
                id="beat-duration"
                type="range"
                min={1}
                max={2}
                step={0.1}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Range: 1 to 2 minutes ({durationMinutes.toFixed(1)} min)
              </p>
            </div>

            <button
              type="button"
              disabled={!engineOnline || musicTags.trim().length === 0}
              className="w-full rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => void handleGenerateBeat()}
            >
              {isGenerating ? "Generating…" : "Generate Beat"}
            </button>

            {generatedTracks.length > 0 && (
              <div className="space-y-2 mt-3">
                {generatedTracks.map((t, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <audio controls src={t} className="w-full" />
                    <a
                      href={t}
                      download={`generated_track_${i + 1}.wav`}
                      className="text-xs text-muted-foreground underline ml-2"
                    >
                      Download
                    </a>
                  </div>
                ))}
                {generationInfo ? (
                  <p className="text-xs text-muted-foreground">
                    {generationInfo}
                  </p>
                ) : null}
              </div>
            )}
          </div>

          <div
            className={
              activeTab !== "links"
                ? "hidden"
                : "space-y-2 rounded-md border border-border/60 bg-muted/20 p-3"
            }
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
                Beat link
              </p>
              {beatLink ? (
                <Badge variant="secondary" className="text-[10px] capitalize">
                  {beatLink.provider}
                </Badge>
              ) : null}
            </div>

            {isBeatLinkLoading ? (
              <div className="h-20 w-full rounded bg-secondary/60 animate-pulse" />
            ) : showBeatLinkForm ? (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Paste a Spotify, YouTube, or SoundCloud URL to open an
                  embedded player in Beat Library.
                </p>
                <BeatLinkForm
                  defaultUrl={beatLink?.url ?? ""}
                  isPending={upsertBeatLinkMutation.isPending}
                  onSubmit={handleBeatLinkSubmit}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="h-[220px] overflow-hidden rounded border border-border/60 bg-card">
                  {renderEmbedPlayer(embeddedBeatLink ?? beatLink!)}
                </div>
                <button
                  type="button"
                  className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary"
                  onClick={() => setReplacingBeatLink(true)}
                >
                  Replace Link
                </button>
              </div>
            )}
          </div>

          <div className={activeTab !== "recent" ? "hidden" : "space-y-2"}>
            {isRecentBeatsLoading ? (
              <div className="space-y-2">
                <div className="h-16 rounded bg-secondary/60 animate-pulse" />
                <div className="h-16 rounded bg-secondary/60 animate-pulse" />
                <div className="h-16 rounded bg-secondary/60 animate-pulse" />
              </div>
            ) : recentBeats.length === 0 ? (
              <div className="rounded-md border border-border/60 bg-muted/20 px-3 py-4 text-xs text-muted-foreground">
                No beats yet. Upload/generate a beat or add a beat link to build
                your recent list.
              </div>
            ) : (
              recentBeats.map((item) => (
                <div
                  key={item.id}
                  className="rounded-md border border-border/60 bg-card px-3 py-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {item.beatName}
                      </p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        From: {item.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <Badge
                      variant={sourceBadgeVariant(item.sourceTag)}
                      className="text-[10px] capitalize"
                    >
                      {item.sourceTag}
                    </Badge>
                  </div>

                  {loadedBeatId === item.id ? (
                    <div className="mt-1">
                      <Badge variant="outline" className="text-[10px]">
                        Currently loaded
                      </Badge>
                    </div>
                  ) : null}

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    {item.bpm ? (
                      <span>{item.bpm} BPM</span>
                    ) : (
                      <span>BPM n/a</span>
                    )}
                    {item.sourceTag === "link" ? (
                      <>
                        <span className="capitalize">
                          {item.provider ?? "link"}
                        </span>
                        {item.linkUrl ? (
                          <a
                            href={item.linkUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="underline hover:text-foreground"
                          >
                            Open link
                          </a>
                        ) : null}
                      </>
                    ) : (
                      <span className="truncate">
                        {labelFromStoragePath(item.storagePath)}
                      </span>
                    )}
                  </div>

                  {editingBeatId === item.id ? (
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        value={editingBeatName}
                        onChange={(e) => setEditingBeatName(e.target.value)}
                        className="h-8 flex-1 rounded-md border border-input bg-background px-2 text-xs outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                        maxLength={120}
                      />
                      <Button
                        type="button"
                        size="sm"
                        disabled={renameBeatMutation.isPending}
                        onClick={() => saveBeatName(item)}
                      >
                        Save
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={cancelEditingBeat}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : null}

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {item.kind === "file" ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={
                          loadingBeatId === item.id ||
                          deleteBeatMutation.isPending
                        }
                        onClick={() => void handleLoadBeat(item)}
                      >
                        {loadingBeatId === item.id
                          ? "Loading..."
                          : "Load into player"}
                      </Button>
                    ) : null}

                    {item.kind === "link" ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={isBeatLinkLoading}
                        onClick={() => void handleLoadRecentLink(item)}
                      >
                        Load
                      </Button>
                    ) : null}

                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={
                        renameBeatMutation.isPending ||
                        deleteBeatMutation.isPending
                      }
                      onClick={() => startEditingBeat(item)}
                    >
                      Edit name
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      disabled={deleteBeatMutation.isPending}
                      onClick={() => setDeleteTarget(item)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}

            <div className="pt-1">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleUploadFromRecents}
              >
                Upload Beat
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete beat from library?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will remove the selected{" "}
              {deleteTarget?.sourceTag ?? "beat"} entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {/* Use the same pattern as SnippetFormDialog: plain Buttons that call handlers
                directly. The AlertDialog is controlled by `deleteTarget` so setting it
                to null will close the dialog. This avoids composition issues with asChild. */}
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div
        className="absolute top-0 left-4 right-4 h-1 cursor-n-resize z-10"
        onPointerDown={(e) => onResizePointerDown(e, "n")}
        onPointerMove={onResizePointerMove}
        onPointerUp={onResizePointerUp}
        onPointerCancel={onResizePointerCancel}
        style={{ touchAction: "none" }}
      />
      <div
        className="absolute bottom-0 left-4 right-4 h-1 cursor-s-resize z-10"
        onPointerDown={(e) => onResizePointerDown(e, "s")}
        onPointerMove={onResizePointerMove}
        onPointerUp={onResizePointerUp}
        onPointerCancel={onResizePointerCancel}
        style={{ touchAction: "none" }}
      />
      <div
        className="absolute left-0 top-4 bottom-4 w-1 cursor-w-resize z-10"
        onPointerDown={(e) => onResizePointerDown(e, "w")}
        onPointerMove={onResizePointerMove}
        onPointerUp={onResizePointerUp}
        onPointerCancel={onResizePointerCancel}
        style={{ touchAction: "none" }}
      />
      <div
        className="absolute right-0 top-4 bottom-4 w-1 cursor-e-resize z-10"
        onPointerDown={(e) => onResizePointerDown(e, "e")}
        onPointerMove={onResizePointerMove}
        onPointerUp={onResizePointerUp}
        onPointerCancel={onResizePointerCancel}
        style={{ touchAction: "none" }}
      />
      <div
        className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-10"
        onPointerDown={(e) => onResizePointerDown(e, "nw")}
        onPointerMove={onResizePointerMove}
        onPointerUp={onResizePointerUp}
        onPointerCancel={onResizePointerCancel}
        style={{ touchAction: "none" }}
      />
      <div
        className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize z-10"
        onPointerDown={(e) => onResizePointerDown(e, "ne")}
        onPointerMove={onResizePointerMove}
        onPointerUp={onResizePointerUp}
        onPointerCancel={onResizePointerCancel}
        style={{ touchAction: "none" }}
      />
      <div
        className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-10"
        onPointerDown={(e) => onResizePointerDown(e, "sw")}
        onPointerMove={onResizePointerMove}
        onPointerUp={onResizePointerUp}
        onPointerCancel={onResizePointerCancel}
        style={{ touchAction: "none" }}
      />
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-10"
        onPointerDown={(e) => onResizePointerDown(e, "se")}
        onPointerMove={onResizePointerMove}
        onPointerUp={onResizePointerUp}
        onPointerCancel={onResizePointerCancel}
        style={{ touchAction: "none" }}
      />
    </div>
  );
}
