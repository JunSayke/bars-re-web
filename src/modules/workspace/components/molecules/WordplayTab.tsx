// @module:workspace @layer:molecule @scope:module:workspace @deps:hook:useWordplayMutation
"use client";

import { SubmitEvent, useState } from "react";
import { Copy, Sparkles, AlertCircle, Check } from "lucide-react";
import { useWordplayMutation } from "../../hooks/useWordplayMutation";

export function WordplayTab() {
  const [seed, setSeed] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { mutate, data, error, isPending } = useWordplayMutation();

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (seed.trim()) {
      mutate(seed);
    }
  };

  const handleCopy = (couplet: string[], index: number) => {
    navigator.clipboard.writeText(couplet.join("\n"));
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
          placeholder="I-type ang pulong (e.g., gugma, adlaw)..."
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isPending}
        />
        <button
          type="submit"
          disabled={isPending || !seed.trim()}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          {isPending ? (
            <span className="animate-pulse">Naghunahuna...</span>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Himoa
            </>
          )}
        </button>
      </form>

      {/* Error State from Mutation */}
      {error && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <p className="text-sm">{error.message}</p>
        </div>
      )}

      {/* Graceful Degradation: Invalid Concept from AI */}
      {data?.isValidConcept === false && data.errorMessage && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <p className="text-sm">{data.errorMessage}</p>
        </div>
      )}

      {/* Loading Skeleton */}
      {isPending && (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3 rounded-lg border p-4">
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted"></div>
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted"></div>
              <div className="mt-4 h-3 w-full animate-pulse rounded bg-muted/50"></div>
            </div>
          ))}
        </div>
      )}

      {/* Output Cards */}
      {data?.isValidConcept && data.suggestions && !isPending && (
        <div className="flex flex-col gap-4">
          {data.suggestions.map((item, index) => (
            <div
              key={index}
              className="group relative flex flex-col gap-3 rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
            >
              <button
                onClick={() => handleCopy(item.couplet, index)}
                className="absolute right-4 top-4 rounded-md p-2 opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100"
                title="Copy couplet"
              >
                {copiedIndex === index ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 text-muted-foreground" />
                )}
              </button>

              <div className="pr-8">
                {item.couplet.map((line, i) => (
                  <p key={i} className="text-lg font-medium italic">
                    {line}
                  </p>
                ))}
              </div>

              <div className="mt-1 border-t pt-2 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Pasabot (Meaning):</strong> {item.explanation}
                </p>
                <p>
                  <strong className="text-foreground">English:</strong> {item.englishTranslation}
                </p>
              </div>

              <div className="absolute bottom-4 right-4 rounded bg-muted px-2 py-1 text-xs font-bold text-muted-foreground">
                Score: {item.qualityScore}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
