"use client"

import { useState } from "react"
import { ThesaurusTabButton } from "../atoms/ThesaurusTabButton"
import { WordLookupTab } from "../molecules/WordLookupTab"

const TABS = [
  { id: "word-lookup", label: "Word Lookup" },
  { id: "rhyme", label: "Rhyme" },
  { id: "synonyms", label: "Synonyms" },
  { id: "anagrams", label: "Anagrams" },
  { id: "wordplay", label: "Wordplay" },
] as const

type TabId = (typeof TABS)[number]["id"]

export function ThesaurusTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("word-lookup")

  return (
    <div className="flex flex-col h-full">
      {/* Tab strip */}
      <div className="flex border-b border-border flex-shrink-0 overflow-x-auto">
        {TABS.map((tab) => (
          <ThesaurusTabButton
            key={tab.id}
            label={tab.label}
            isActive={activeTab === tab.id}
            isDisabled={tab.id !== "word-lookup"}
            onClick={() => {
              if (tab.id === "word-lookup") setActiveTab("word-lookup")
            }}
          />
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden pt-3">
        {activeTab === "word-lookup" && <WordLookupTab />}
      </div>
    </div>
  )
}
