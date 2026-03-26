import type { Snippet } from "../types/snippet.types"

export const mockSnippets: Snippet[] = [
  {
    id: "snippet-001",
    userId: "user-1",
    title: "Mao ni akong tingog",
    content:
      "Mao ni akong tingog, dili ko mohunong\nBisan asa ko adto, akong kanta molungtad\nGikan sa kinabuhi, nagsulat ko ug bahin\nSa mga tinubdan sa akong kasingkasing",
    tags: ["Verse"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: "snippet-002",
    userId: "user-1",
    title: "Ako kasingkasing",
    content:
      "Ako kasingkasing nagdilaab sa kalayo\nSa bawat nota ug rima nga akong gisulti\nKanta para sa tanan, para sa gugma\nAng musika mao ang pinulong sa akong kalag",
    tags: ["Chorus"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: "snippet-003",
    userId: "user-1",
    title: "Kini ang tingog sa mga Bisaya",
    content:
      "Kini ang tingog sa mga Bisaya\nGikan sa Sugbo hangtud Davao\nAng kultura naton dili malimtan\nBisan asa kita adto, Bisaya gayud ta",
    tags: ["Hook"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
]

let snippetCounter = mockSnippets.length

export function buildMockSnippet(overrides?: Partial<Snippet>): Snippet {
  snippetCounter += 1
  return {
    id: `snippet-${String(snippetCounter).padStart(3, "0")}`,
    userId: "user-1",
    title: `New Snippet ${snippetCounter}`,
    content: "",
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}
