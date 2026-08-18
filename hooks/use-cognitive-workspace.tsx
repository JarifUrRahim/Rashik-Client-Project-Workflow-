import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { addEntry, appendChatMessage, clearChatHistory, createChatMessage, createEntry, EMPTY_WORKSPACE, parseWorkspace, ReflectionMode, removeEntry, WorkspaceState } from "@/lib/cognitive";
import type { AppLanguage } from "@/lib/i18n";

const STORAGE_KEY = "@awake/local-workspace/v3";
type WorkspaceApi = { state: WorkspaceState; ready: boolean; acceptBoundary: () => Promise<void>; saveEntry: (input: { thought: string; mode: ReflectionMode; responses: string[]; prompts?: readonly string[] }) => Promise<void>; deleteEntry: (id: string) => Promise<void>; reset: () => Promise<void>; setLanguage: (language: AppLanguage) => Promise<void>; setOnlineChatConsent: (enabled: boolean) => Promise<void>; appendChat: (role: "user" | "assistant", content: string) => Promise<void>; clearChat: () => Promise<void>; };
const WorkspaceContext = createContext<WorkspaceApi | null>(null);
export function CognitiveWorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WorkspaceState>(EMPTY_WORKSPACE); const [ready, setReady] = useState(false); const stateRef = useRef<WorkspaceState>(EMPTY_WORKSPACE);
  useEffect(() => { let live = true; void AsyncStorage.getItem(STORAGE_KEY).then((saved) => { if (!live) return; const next = parseWorkspace(saved); stateRef.current = next; setState(next); }).finally(() => live && setReady(true)); return () => { live = false; }; }, []);
  const commit = useCallback(async (recipe: (current: WorkspaceState) => WorkspaceState) => { const next = recipe(stateRef.current); stateRef.current = next; setState(next); await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)); }, []);
  const acceptBoundary = useCallback(async () => commit((current) => ({ ...current, onboarded: true })), [commit]);
  const saveEntry = useCallback(async (input: { thought: string; mode: ReflectionMode; responses: string[]; prompts?: readonly string[] }) => { const entry = createEntry(input); await commit((current) => addEntry(current, entry)); }, [commit]);
  const deleteEntry = useCallback(async (id: string) => commit((current) => removeEntry(current, id)), [commit]);
  const setLanguage = useCallback(async (language: AppLanguage) => commit((current) => ({ ...current, language })), [commit]);
  const setOnlineChatConsent = useCallback(async (enabled: boolean) => commit((current) => ({ ...current, onlineChatConsent: enabled })), [commit]);
  const appendChat = useCallback(async (role: "user" | "assistant", content: string) => { const message = createChatMessage(role, content); await commit((current) => appendChatMessage(current, message)); }, [commit]);
  const clearChat = useCallback(async () => commit((current) => clearChatHistory(current)), [commit]);
  const reset = useCallback(async () => { stateRef.current = EMPTY_WORKSPACE; setState(EMPTY_WORKSPACE); await AsyncStorage.removeItem(STORAGE_KEY); }, []);
  const value = useMemo(() => ({ state, ready, acceptBoundary, saveEntry, deleteEntry, reset, setLanguage, setOnlineChatConsent, appendChat, clearChat }), [state, ready, acceptBoundary, saveEntry, deleteEntry, reset, setLanguage, setOnlineChatConsent, appendChat, clearChat]);
  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}
export function useCognitiveWorkspace() { const value = useContext(WorkspaceContext); if (!value) throw new Error("useCognitiveWorkspace must be used within CognitiveWorkspaceProvider"); return value; }
