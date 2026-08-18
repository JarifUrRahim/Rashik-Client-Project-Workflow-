import { describe, expect, it } from "vitest";
import { buildAwakeMessages, normalizeAwakeTurns } from "../server/awake-policy";
import { appendChatMessage, createChatMessage, EMPTY_WORKSPACE, parseWorkspace } from "../lib/cognitive";

describe("aWake consent-based chat policy", () => {
  it("keeps only valid recent chat turns and adds the Cognitive Mirror policy", () => {
    const turns = normalizeAwakeTurns([{ role: "user", content: "  Help me see this clearly  " }, { role: "assistant", content: "I can help." }]);
    const messages = buildAwakeMessages(turns);
    expect(messages[0].role).toBe("system");
    expect(messages[0].content).toContain("not to replace their agency");
    expect(messages).toHaveLength(3);
  });
  it("persists a local chat record without making cloud sync implicit", () => {
    const state = appendChatMessage({ ...EMPTY_WORKSPACE, onboarded: true, onlineChatConsent: true }, createChatMessage("user", "I need one next step.", "2026-08-12T06:00:00.000Z"));
    const hydrated = parseWorkspace(JSON.stringify(state));
    expect(hydrated.chatHistory).toHaveLength(1);
    expect(hydrated.onlineChatConsent).toBe(true);
  });

  it("instructs aWake to respond in Bangla when the selected language is Bangla", () => {
    const messages = buildAwakeMessages([{ role: "user", content: "আমি একটি সিদ্ধান্ত নিয়ে ভাবছি" }], "bn");
    expect(messages[0].content).toContain("Reply in natural, clear Bangla");
  });
});
