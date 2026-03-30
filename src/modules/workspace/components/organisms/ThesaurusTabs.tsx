"use client"

import { useState } from "react"
import { ThesaurusTabButton } from "../atoms/ThesaurusTabButton"
import { WordLookupTab } from "../molecules/WordLookupTab"
import { RhymeFinderTab } from "../molecules/RhymeFinderTab"
import { SynonymFinderTab } from "../molecules/SynonymFinderTab"
import { AnagramFinderTab } from "../molecules/AnagramFinderTab"

const TABS = [
  { id: "word-lookup", label: "Word Lookup" },
  { id: "rhyme", label: "Rhyme" },
  { id: "synonyms", label: "Synonyms" },
  { id: "anagrams", label: "Anagrams" },
  { id: "wordplay", label: "Wordplay" },
] as const

type TabId = (typeof TABS)[number]["id"]

const DISABLED_TABS: TabId[] = ["wordplay"]

export function ThesaurusTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("word-lookup")
  const [activeWord, setActiveWord] = useState("")

  return (
    <div className="flex flex-col h-full">
      {/* Tab strip */}
      <div className="flex border-b border-border flex-shrink-0 overflow-x-auto">
        {TABS.map((tab) => (
          <ThesaurusTabButton
            key={tab.id}
            label={tab.label}
            isActive={activeTab === tab.id}
            isDisabled={DISABLED_TABS.includes(tab.id)}
            onClick={() => {
              if (!DISABLED_TABS.includes(tab.id)) setActiveTab(tab.id)
            }}
          />
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden pt-3">
        {activeTab === "word-lookup" && <WordLookupTab initialTerm={activeWord} />}
        {activeTab === "rhyme" && (
          <RhymeFinderTab
            onSelectWord={(w) => {
              setActiveWord(w)
              setActiveTab("word-lookup")
            }}
          />
        )}
        {activeTab === "synonyms" && (
          <SynonymFinderTab
            onSelectWord={(w) => {
              setActiveWord(w)
              setActiveTab("word-lookup")
            }}
          />
        )}
        {activeTab === "anagrams" && (
          <AnagramFinderTab
            onSelectWord={(w) => {
              setActiveWord(w)
              setActiveTab("word-lookup")
            }}
          />
        )}
      </div>
    </div>
  )
}
