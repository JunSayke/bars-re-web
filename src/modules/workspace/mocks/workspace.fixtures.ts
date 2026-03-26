import type { WritingSession } from "../schemas/workspace.schema"

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
