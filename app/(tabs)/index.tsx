import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";

import { BrandMark } from "@/components/brand-mark";
import { EntryCard } from "@/components/entry-card";
import { ScreenContainer } from "@/components/screen-container";
import { useCognitiveWorkspace } from "@/hooks/use-cognitive-workspace";
import { ReflectionMode } from "@/lib/cognitive";
import { modeMeta, t } from "@/lib/i18n";

const modes: ReflectionMode[] = ["clarify", "plan", "reflect"];

export default function MirrorScreen() {
  const router = useRouter();
  const { state, ready, acceptBoundary, saveEntry } = useCognitiveWorkspace();
  const [thought, setThought] = useState("");
  const [mode, setMode] = useState<ReflectionMode>("clarify");
  const [responses, setResponses] = useState<string[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const meta = modeMeta(state.language, mode);
  const tx = (key: Parameters<typeof t>[1]) => t(state.language, key);
  const recent = useMemo(() => state.entries.slice(0, 3), [state.entries]);

  function begin() { if (thought.trim()) { setResponses(meta.prompts.map(() => "")); setSheetOpen(true); } }
  async function save() { setSaving(true); await saveEntry({ thought, mode, responses, prompts: meta.prompts }); setSaving(false); setSheetOpen(false); setThought(""); }
  async function saveToWorkspace() {
    if (!thought.trim() || saving) return;
    setSaving(true);
    await saveEntry({ thought, mode, responses: meta.prompts.map(() => ""), prompts: meta.prompts });
    setSaving(false);
    setThought("");
    router.navigate("/workspace");
  }

  if (!ready) return <ScreenContainer style={styles.center}><ActivityIndicator color="#69D8E3" /></ScreenContainer>;
  return (
    <ScreenContainer style={styles.screen}>
      <FlatList data={recent} keyExtractor={(entry) => entry.id} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <EntryCard entry={item} onPress={() => router.navigate("/workspace")} />}
        ListHeaderComponent={<View>
          <BrandMark compact />
          <Text style={styles.kicker}>{tx("clarityWorkspace")}</Text>
          <Text style={styles.title}>{tx("mirrorTitle")}</Text>
          <Text style={styles.copy}>{tx("mirrorCopy")}</Text>
          <View style={styles.notice}><View style={styles.light} /><View style={styles.noticeText}><Text style={styles.noticeTitle}>Local-first is active</Text><Text style={styles.noticeCopy}>No cloud sync, external model, hidden memory, or silent action is active.</Text></View></View>
          <Text style={styles.label}>{tx("whatPresent")}</Text>
          <View style={styles.composer}><TextInput accessibilityLabel="Current thought" multiline maxLength={700} onChangeText={setThought} placeholder={tx("thoughtPlaceholder")} placeholderTextColor="#71809A" style={styles.input} textAlignVertical="top" value={thought} /><View style={styles.composerFoot}><Text style={styles.hint}>{tx("nothingSavedUntil")}</Text><Text style={styles.hint}>{thought.trim().length}/700</Text></View><Pressable accessibilityLabel="Save this thought to Workspace" disabled={!thought.trim() || saving} onPress={() => void saveToWorkspace()} style={({ pressed }) => [styles.quickSave, (!thought.trim() || saving) && styles.quickSaveDisabled, pressed && styles.pressed]}><View><Text style={[styles.quickSaveTitle, (!thought.trim() || saving) && styles.quickSaveTitleDisabled]}>{saving ? tx("saving") : tx("saveWorkspace")}</Text><Text style={[styles.quickSaveCopy, (!thought.trim() || saving) && styles.quickSaveCopyDisabled]}>{tx("saveWorkspaceCopy")}</Text></View><Text style={[styles.quickSaveArrow, (!thought.trim() || saving) && styles.quickSaveArrowDisabled]}>→</Text></Pressable></View>
          <View style={styles.modeRow}>{modes.map((item) => { const itemMeta = modeMeta(state.language, item); return <Pressable key={item} onPress={() => setMode(item)} style={({ pressed }) => [styles.pill, mode === item && { borderColor: itemMeta.accent, backgroundColor: `${itemMeta.accent}1C` }, pressed && styles.pressed]}><Text style={[styles.pillText, mode === item && { color: itemMeta.accent }]}>{itemMeta.label}</Text></Pressable>; })}</View>
          <Text style={[styles.modeDescription, { color: meta.accent }]}>{meta.description}</Text>
          <Pressable disabled={!thought.trim()} onPress={begin} style={({ pressed }) => [styles.primary, !thought.trim() && styles.disabled, pressed && styles.pressed]}><Text style={[styles.primaryText, !thought.trim() && styles.primaryTextDisabled]}>{tx("exploreBeforeSaving")}</Text><Text style={[styles.arrow, !thought.trim() && styles.primaryTextDisabled]}>→</Text></Pressable>
          <View style={styles.sectionRow}><Text style={styles.section}>{tx("recentReflections")}</Text>{state.entries.length ? <Pressable onPress={() => router.navigate("/workspace")}><Text style={styles.link}>{tx("viewWorkspace")}</Text></Pressable> : null}</View>
        </View>}
        ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyTitle}>{tx("emptyMirror")}</Text><Text style={styles.emptyCopy}>{tx("emptyMirrorCopy")}</Text></View>}
      />
      <Modal transparent animationType="fade" visible={!state.onboarded || sheetOpen} onRequestClose={() => setSheetOpen(false)}>
        {!state.onboarded ? <View style={styles.backdrop}><View style={styles.charter}><BrandMark /><Text style={styles.charterKicker}>{tx("welcome")}</Text><Text style={styles.charterTitle}>{tx("privatePlace")}</Text><Text style={styles.charterCopy}>{state.language === "bn" ? "Rashik — The Awakening মানুষের উদ্দেশ্য বহন করে। aWake হলো পরবর্তী ধাপের intelligence model। আজকের এই স্থানীয় ওয়ার্কস্পেস আপনার ভাবনা কোথাও পাঠায় না।" : "Rashik — The Awakening provides the human purpose. aWake is the intelligence model planned for the next stage. Today, this local workspace does not send your thoughts anywhere."}</Text><View style={styles.rule}><Text style={styles.ruleTitle}>{tx("youControl")}</Text><Text style={styles.ruleCopy}>{tx("youControlCopy")}</Text></View><Pressable onPress={() => void acceptBoundary()} style={({ pressed }) => [styles.primary, pressed && styles.pressed]}><Text style={styles.primaryText}>{tx("enterWorkspace")}</Text><Text style={styles.arrow}>→</Text></Pressable></View></View> : <View style={styles.sheetBack}><View style={styles.sheet}><View style={styles.handle}/><View style={styles.sheetHeader}><View><Text style={[styles.sheetMode, { color: meta.accent }]}>{meta.label}</Text><Text style={styles.sheetTitle}>{state.language === "bn" ? "ভাবনাটিকে আরও পরিষ্কার হতে দিন।" : "Let the thought become clearer."}</Text></View><Pressable onPress={() => setSheetOpen(false)} style={styles.close}><Text style={styles.closeText}>×</Text></Pressable></View><Text style={styles.sheetThought}>{thought}</Text><FlatList style={styles.promptList} contentContainerStyle={styles.promptContent} data={meta.prompts} keyExtractor={(item) => item} renderItem={({ item, index }) => <View style={styles.promptGroup}><Text style={styles.prompt}>{item}</Text><TextInput multiline onChangeText={(value) => setResponses((current) => current.map((entry, itemIndex) => itemIndex === index ? value : entry))} placeholder={state.language === "bn" ? "আপনার জন্য যা সত্য, সেটি লিখুন…" : "Write what is true for you…"} placeholderTextColor="#71809A" style={styles.answer} textAlignVertical="top" value={responses[index]} /></View>} /><Pressable disabled={saving} onPress={() => void save()} style={({ pressed }) => [styles.primary, saving && styles.disabled, pressed && styles.pressed]}><Text style={[styles.primaryText, saving && styles.primaryTextDisabled]}>{saving ? tx("saving") : tx("save")}</Text><Text style={[styles.arrow, saving && styles.primaryTextDisabled]}>→</Text></Pressable></View></View>}
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: "#0B1020" }, center: { alignItems: "center", backgroundColor: "#0B1020", justifyContent: "center" }, content: { paddingBottom: 28, paddingHorizontal: 20, paddingTop: 18 },
  kicker: { color: "#69D8E3", fontSize: 10, fontWeight: "800", letterSpacing: 0.8, marginTop: 24 }, title: { color: "#F4F7FB", fontSize: 34, fontWeight: "800", letterSpacing: -1.1, lineHeight: 40, marginTop: 6 }, copy: { color: "#A7B3C9", fontSize: 15, lineHeight: 22, marginTop: 12 },
  notice: { alignItems: "center", backgroundColor: "#10192D", borderColor: "#244254", borderRadius: 16, borderWidth: 1, flexDirection: "row", gap: 10, marginTop: 24, padding: 13 }, light: { backgroundColor: "#69D6A3", borderRadius: 7, height: 8, width: 8 }, noticeText: { flex: 1 }, noticeTitle: { color: "#DAE6F5", fontSize: 13, fontWeight: "800" }, noticeCopy: { color: "#8F9DB6", fontSize: 12, lineHeight: 17, marginTop: 2 },
  label: { color: "#8390AA", fontSize: 11, fontWeight: "800", letterSpacing: 0.9, marginTop: 29 }, composer: { backgroundColor: "#151D33", borderColor: "#26334E", borderRadius: 20, borderWidth: 1, marginTop: 10, padding: 15 }, input: { color: "#F4F7FB", fontSize: 17, lineHeight: 25, minHeight: 104, padding: 0 }, composerFoot: { borderTopColor: "#26334E", borderTopWidth: 1, flexDirection: "row", justifyContent: "space-between", marginTop: 11, paddingTop: 10 }, hint: { color: "#73809B", fontSize: 11 }, quickSave: { alignItems: "center", backgroundColor: "#63DFE9", borderColor: "#D7FBFF", borderRadius: 14, borderWidth: 1, flexDirection: "row", justifyContent: "space-between", marginTop: 13, minHeight: 62, paddingHorizontal: 14, shadowColor: "#69D8E3", shadowOpacity: 0.2, shadowRadius: 10 }, quickSaveDisabled: { backgroundColor: "#20324A", borderColor: "#425A78", shadowOpacity: 0 }, quickSaveTitle: { color: "#06111D", fontSize: 15, fontWeight: "900" }, quickSaveTitleDisabled: { color: "#D4E0EF" }, quickSaveCopy: { color: "#123445", fontSize: 11, fontWeight: "700", marginTop: 2 }, quickSaveCopyDisabled: { color: "#A4B4C9" }, quickSaveArrow: { color: "#06111D", fontSize: 23, fontWeight: "900" }, quickSaveArrowDisabled: { color: "#D4E0EF" },
  modeRow: { flexDirection: "row", gap: 8, marginTop: 15 }, pill: { borderColor: "#26334E", borderRadius: 99, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 9 }, pillText: { color: "#A7B3C9", fontSize: 13, fontWeight: "700" }, modeDescription: { fontSize: 12, lineHeight: 18, marginTop: 9 }, primary: { alignItems: "center", backgroundColor: "#63DFE9", borderColor: "#D7FBFF", borderRadius: 16, borderWidth: 1, flexDirection: "row", justifyContent: "space-between", marginTop: 18, minHeight: 54, paddingHorizontal: 18 }, primaryText: { color: "#06111D", fontSize: 15, fontWeight: "900" }, primaryTextDisabled: { color: "#D4E0EF" }, arrow: { color: "#06111D", fontSize: 22, fontWeight: "700" }, disabled: { backgroundColor: "#20324A", borderColor: "#425A78" }, pressed: { opacity: 0.74, transform: [{ scale: 0.985 }] },
  sectionRow: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 12, marginTop: 33 }, section: { color: "#F4F7FB", fontSize: 18, fontWeight: "800" }, link: { color: "#69D8E3", fontSize: 13, fontWeight: "800" }, empty: { alignItems: "center", backgroundColor: "#10192D", borderColor: "#24324D", borderRadius: 20, borderStyle: "dashed", borderWidth: 1, gap: 7, padding: 25 }, emptyTitle: { color: "#E9EFF9", fontSize: 15, fontWeight: "800" }, emptyCopy: { color: "#94A2BA", fontSize: 13, lineHeight: 19, maxWidth: 260, textAlign: "center" },
  backdrop: { alignItems: "center", backgroundColor: "rgba(4, 7, 16, 0.84)", flex: 1, justifyContent: "center", padding: 22 }, charter: { backgroundColor: "#151D33", borderColor: "#2C3A58", borderRadius: 28, borderWidth: 1, gap: 14, maxWidth: 420, padding: 24, width: "100%" }, charterKicker: { color: "#69D8E3", fontSize: 10, fontWeight: "900", letterSpacing: 1.1 }, charterTitle: { color: "#F4F7FB", fontSize: 26, fontWeight: "800", letterSpacing: -0.6, lineHeight: 32 }, charterCopy: { color: "#A7B3C9", fontSize: 14, lineHeight: 21 }, rule: { backgroundColor: "#0D1426", borderRadius: 16, gap: 4, padding: 14 }, ruleTitle: { color: "#69D6A3", fontSize: 13, fontWeight: "900" }, ruleCopy: { color: "#B4C0D3", fontSize: 13, lineHeight: 18 },
  sheetBack: { backgroundColor: "rgba(4, 7, 16, 0.72)", flex: 1, justifyContent: "flex-end" }, sheet: { backgroundColor: "#10182B", borderTopColor: "#2C3A58", borderTopLeftRadius: 30, borderTopRightRadius: 30, borderTopWidth: 1, height: "87%", paddingBottom: 20, paddingHorizontal: 20 }, handle: { alignSelf: "center", backgroundColor: "#44516A", borderRadius: 10, height: 4, marginVertical: 11, width: 42 }, sheetHeader: { alignItems: "flex-start", flexDirection: "row", justifyContent: "space-between" }, sheetMode: { fontSize: 11, fontWeight: "900", letterSpacing: 1.1 }, sheetTitle: { color: "#F4F7FB", fontSize: 22, fontWeight: "800", marginTop: 4 }, close: { alignItems: "center", backgroundColor: "#202B43", borderRadius: 18, height: 36, justifyContent: "center", width: 36 }, closeText: { color: "#C5D0E0", fontSize: 24, lineHeight: 26 }, sheetThought: { color: "#A7B3C9", fontSize: 14, lineHeight: 20, marginTop: 14 }, promptList: { flex: 1 }, promptContent: { gap: 15, paddingBottom: 12, paddingTop: 18 }, promptGroup: { gap: 8 }, prompt: { color: "#DCE8F5", fontSize: 14, fontWeight: "800", lineHeight: 20 }, answer: { backgroundColor: "#151D33", borderColor: "#26334E", borderRadius: 14, borderWidth: 1, color: "#F4F7FB", fontSize: 14, lineHeight: 20, minHeight: 76, padding: 12 },
});
