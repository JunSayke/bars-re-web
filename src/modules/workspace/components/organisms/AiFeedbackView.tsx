"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
// Adjust import path if needed based on your exact folder structure
import { getLyricsFeedback } from "../../actions/get-feedback.action"

// Define the expected shape based on the AI feedback schema
interface FeedbackResult {
  score?: number
  flowIssues?: Array<{ line: string; issue: string; suggestion: string }>
  generalSuggestions?: string[]
}

export function AiFeedbackView() {
  const [text, setText] = useState("")
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null)
  const [isPending, startTransition] = useTransition()

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length
  const MAX_WORDS = 150

  const handleAnalyze = () => {
    if (!text.trim()) return
    startTransition(async () => {
      try {
        // NOTE: If your Server Action expects an object, change this to: await getLyricsFeedback({ lyrics: text })
        const result = await getLyricsFeedback(text)
        setFeedback(result as FeedbackResult)
      } catch (error) {
        toast.error("Analysis failed. Please try again.")
        console.error(error)
      }
    })
  }

  const handleReset = () => {
    setFeedback(null)
  }

  // --- RESULTS STATE (Task 2.4 & 3.2) ---
  if (feedback) {
    return (
      <div className="flex flex-col h-full gap-4 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Analysis Results</h3>
          {feedback.score !== undefined && (
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
              {feedback.score}
            </div>
          )}
        </div>

        {feedback.flowIssues && feedback.flowIssues.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Flow Issues</h4>
            <ul className="space-y-3">
              {feedback.flowIssues.map((issue, i) => (
                <li key={i} className="text-sm bg-secondary/40 p-3 rounded-md border border-border">
                  <p className="font-mono text-xs mb-2 text-muted-foreground italic">"{issue.line}"</p>
                  <p className="text-foreground mb-1"><span className="font-semibold text-destructive">Issue:</span> {issue.issue}</p>
                  <p className="text-foreground"><span className="font-semibold text-primary">Fix:</span> {issue.suggestion}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {feedback.generalSuggestions && feedback.generalSuggestions.length > 0 && (
          <div className="space-y-2 mt-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">General Suggestions</h4>
            <ul className="list-disc pl-5 space-y-1">
              {feedback.generalSuggestions.map((sug, i) => (
                <li key={i} className="text-sm text-foreground">{sug}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleReset}
          className="mt-4 w-full py-2 px-4 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm font-medium"
        >
          Analyze Another Verse
        </button>
      </div>
    )
  }

  // --- INPUT & LOADING STATE (Task 2.2 & 2.3) ---
  return (
    <div className="flex flex-col h-full gap-3">
      <p className="text-sm text-muted-foreground">
        Paste a verse or specific lines here to get targeted feedback on flow, rhythm, and wordplay.
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isPending}
        placeholder="Got my mind on the money..."
        className="flex-1 w-full p-3 text-sm rounded-md border border-input bg-background resize-none focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
      />
      <div className="flex items-center justify-between">
        <span className={`text-xs ${wordCount > MAX_WORDS ? "text-destructive font-medium" : "text-muted-foreground"}`}>
          {wordCount} / {MAX_WORDS} words
        </span>
        <button
          onClick={handleAnalyze}
          disabled={isPending || !text.trim() || wordCount > MAX_WORDS}
          className="py-2 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors text-sm font-medium flex items-center justify-center min-w-[120px]"
        >
          {isPending ? "Analyzing..." : "Analyze Lyrics"}
        </button>
      </div>
    </div>
  )
}
