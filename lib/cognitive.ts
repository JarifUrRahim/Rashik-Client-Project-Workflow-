import type { AppLanguage } from "@/lib/i18n";

export type ReflectionMode = "clarify" | "plan" | "reflect";
export type ChatRole = "user" | "assistant";
export type ReflectionAnswer = { prompt: string; response: string };
export type ChatMessage = { id: string; role: ChatRole; content: string; createdAt: string };
export type MirrorEntry = { id: string; mode: ReflectionMode; thought: string; answers: ReflectionAnswer[]; createdAt: string };
export type WorkspaceState = { onboarded: boolean; onlineChatConsent: boolean; language: AppLanguage; entries: MirrorEntry[]; chatHistory: ChatMessage[] };

export const EMPTY_WORKSPACE: WorkspaceState = { onboarded: false, onlineChatConsent: false, language: "bn", entries: [], chatHistory: [] };
const DEFAULT_PROMPTS: Record<ReflectionMode, string[]> = { clarify: ["What do I know for certain?", "What remains unclear?", "What would make this clearer?"], plan: ["What matters most right now?", "What is one next step I can complete?", "When will I return to review this?"], reflect: ["What feels important in this moment?", "What is shaping this feeling?", "What do I need with kindness?"] };
export const MODE_META: Record<ReflectionMode, { label: string; accent: string; description: string; prompts: string[] }> = {
  clarify: { label: "Clarify", accent: "#69D8E3", description: "Name what is known, what is unclear, and what deserves attention.", prompts: DEFAULT_PROMPTS.clarify },
  plan: { label: "Plan", accent: "#69D6A3", description: "Reduce a meaningful intention to one humane next step.", prompts: DEFAULT_PROMPTS.plan },
  reflect: { label: "Reflect", accent: "#A594FF", description: "Make room for what is present before deciding what comes next.", prompts: DEFAULT_PROMPTS.reflect },
};
function makeId(prefix: string, createdAt: string) { return `${prefix}-${createdAt}-${Math.random().toString(36).slice(2, 8)}`; }
export function createEntry(input: { thought: string; mode: ReflectionMode; responses: string[]; prompts?: readonly string[]; createdAt?: string }): MirrorEntry { const createdAt = input.createdAt ?? new Date().toISOString(); const prompts = input.prompts ?? DEFAULT_PROMPTS[input.mode]; return { id: makeId("entry", createdAt), mode: input.mode, thought: input.thought.trim(), createdAt, answers: prompts.map((prompt, index) => ({ prompt, response: input.responses[index]?.trim() ?? "" })) }; }
export function createChatMessage(role: ChatRole, content: string, createdAt = new Date().toISOString()): ChatMessage { return { id: makeId(role, createdAt), role, content: content.trim(), createdAt }; }
export function nextStep(entry: MirrorEntry): string | null { return entry.mode === "plan" ? entry.answers[1]?.response || null : null; }
export function addEntry(state: WorkspaceState, entry: MirrorEntry): WorkspaceState { return { ...state, entries: [entry, ...state.entries] }; }
export function removeEntry(state: WorkspaceState, id: string): WorkspaceState { return { ...state, entries: state.entries.filter((entry) => entry.id !== id) }; }
export function appendChatMessage(state: WorkspaceState, message: ChatMessage): WorkspaceState { return { ...state, chatHistory: [...state.chatHistory, message].slice(-80) }; }
export function clearChatHistory(state: WorkspaceState): WorkspaceState { return { ...state, chatHistory: [] }; }
export function parseWorkspace(value: string | null): WorkspaceState { if (!value) return EMPTY_WORKSPACE; try { const data = JSON.parse(value) as Partial<WorkspaceState>; if (typeof data.onboarded === "boolean" && Array.isArray(data.entries)) return { onboarded: data.onboarded, onlineChatConsent: data.onlineChatConsent === true, language: data.language === "en" ? "en" : "bn", entries: data.entries, chatHistory: Array.isArray(data.chatHistory) ? data.chatHistory : [] }; } catch { return EMPTY_WORKSPACE; } return EMPTY_WORKSPACE; }
export function formatDate(date: string, language: AppLanguage = "en"): string { return new Date(date).toLocaleString(language === "bn" ? "bn-BD" : "en", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }); }
