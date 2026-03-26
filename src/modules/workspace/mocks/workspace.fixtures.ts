import type { WritingSession, SessionSummary } from "../schemas/workspace.schema"

let sessionCounter = 4

export function buildMockSession(overrides?: Partial<SessionSummary>): SessionSummary {
  sessionCounter += 1
  return {
    id: `session-${String(sessionCounter).padStart(3, "0")}`,
    title: `Untitled — ${new Date().toISOString().slice(0, 10)}`,
    topic: "",
    previewSnippet: "",
    thumbnailType: "lyrics",
    lastModifiedAt: new Date().toISOString(),
    ...overrides,
  }
}

export const mockSession: WritingSession = {
  id: "mock-session-1",
  title: "Bag-ong Awit",
  bars: [
    // VERSE 1 — 4 bars
    { id: "bar-01", text: "Gikan sa mga bungtod sa Sugbo", section: "verse-1", order: 0 },
    { id: "bar-02", text: "Ang akong mga pulong nagdilaab", section: "verse-1", order: 1 },
    { id: "bar-03", text: "Bisaya ang pinulongan sa akong dughan", section: "verse-1", order: 2 },
    { id: "bar-04", text: "Kalipay ug sakit gitago sa matag linya", section: "verse-1", order: 3 },

    // CHORUS — 2 bars
    { id: "bar-05", text: "Kanta, kanta, bisan sa kagabhion", section: "chorus", order: 4 },
    { id: "bar-06", text: "Ang lingaw dili mapugngan sa bisan kinsa", section: "chorus", order: 5 },

    // VERSE 2 — 2 bars (partial)
    { id: "bar-07", text: "Unsa man ang kahulogan niining tanang pag-ampo", section: "verse-2", order: 6 },
    { id: "bar-08", text: "", section: "verse-2", order: 7 },
  ],
}

export const mockSessions: SessionSummary[] = [
  {
    id: "session-001",
    title: "Kalsada ni Tatay",
    topic: "STREET LIFE",
    previewSnippet: "Gikan sa kalsada, nagsugod ang akong amahan...",
    thumbnailType: "lyrics",
    lastModifiedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
  },
  {
    id: "session-002",
    title: "Daghan pa ko",
    topic: "HUSTLE",
    previewSnippet: "Dili ko mohunong, hangtud maabtan ko ang akong damgo...",
    thumbnailType: "beat-linked",
    lastModifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hrs ago
  },
  {
    id: "session-003",
    title: "Baybayon Vibes",
    topic: "REGGAE RAP",
    previewSnippet: "Sa baybayon, naglingkod ko, naghunahuna sa kinabuhi...",
    thumbnailType: "beat-linked",
    lastModifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: "session-004",
    title: "Libre Flow",
    topic: "IMPROV",
    previewSnippet: "Wala'y plano, basta flow ra, ang baba nag-apas sa ritmo...",
    thumbnailType: "lyrics",
    lastModifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
  },
]
