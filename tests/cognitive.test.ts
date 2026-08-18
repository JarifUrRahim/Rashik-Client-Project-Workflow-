import { describe, expect, it } from "vitest";
import { addEntry, createEntry, EMPTY_WORKSPACE, nextStep, parseWorkspace, removeEntry } from "../lib/cognitive";

describe("aWake Stage 1 local Cognitive Mirror", () => {
  const entry = createEntry({ thought: "Prepare for a meaningful conversation", mode: "plan", responses: ["Listen first", "Write three questions", "Friday"], createdAt: "2026-08-12T06:00:00.000Z" });
  it("creates a user-authored plan with one visible next step", () => {
    expect(entry.thought).toBe("Prepare for a meaningful conversation");
    expect(nextStep(entry)).toBe("Write three questions");
  });
  it("persists a valid local workspace structure", () => {
    const state = addEntry({ ...EMPTY_WORKSPACE, onboarded: true }, entry);
    expect(parseWorkspace(JSON.stringify(state))).toEqual(state);
  });
  it("removes an entry without leaving hidden local state", () => {
    const state = addEntry({ ...EMPTY_WORKSPACE, onboarded: true }, entry);
    expect(removeEntry(state, entry.id).entries).toHaveLength(0);
  });
  it("persists an explicit English preference and defaults older local data safely to Bangla", () => {
    const english = parseWorkspace(JSON.stringify({ ...EMPTY_WORKSPACE, onboarded: true, language: "en" }));
    const older = parseWorkspace(JSON.stringify({ onboarded: true, onlineChatConsent: false, entries: [], chatHistory: [] }));
    expect(english.language).toBe("en");
    expect(older.language).toBe("bn");
  });
});
