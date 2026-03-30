// @module:workspace @layer:organism @scope:module:workspace @deps:molecule:WordLookupTab,molecule:RhymeFinderTab,molecule:SynonymFinderTab,molecule:AnagramFinderTab,molecule:WordplayTab
"use client";

import { useState } from "react";
import { WordLookupTab } from "../molecules/WordLookupTab";
import { RhymeFinderTab } from "../molecules/RhymeFinderTab";
import { SynonymFinderTab } from "../molecules/SynonymFinderTab";
import { AnagramFinderTab } from "../molecules/AnagramFinderTab";
import { WordplayTab } from "../molecules/WordplayTab";

const TABS = [
  { id: "lookup", label: "Lookup" },
  { id: "rhymes", label: "Rhymes" },
  { id: "synonyms", label: "Synonyms" },
  { id: "anagrams", label: "Anagrams" },
  { id: "wordplay", label: "Wordplay" },
] as const;

type TabId = typeof TABS[number]["id"];

export function ThesaurusTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("lookup");
  const [activeWord, setActiveWord] = useState("");

  const handleSelectWord = (word: string) => {
    setActiveWord(word);
    setActiveTab("lookup");
  };

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Tab Navigation */}
      <div className="flex w-full overflow-x-auto border-b">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:border-muted hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-1">
        {activeTab === "lookup" && <WordLookupTab initialTerm={activeWord} />}
        {activeTab === "rhymes" && <RhymeFinderTab onSelectWord={handleSelectWord} />}
        {activeTab === "synonyms" && <SynonymFinderTab onSelectWord={handleSelectWord} />}
        {activeTab === "anagrams" && <AnagramFinderTab onSelectWord={handleSelectWord} />}
        {activeTab === "wordplay" && <WordplayTab />}
      </div>
    </div>
  );
}
