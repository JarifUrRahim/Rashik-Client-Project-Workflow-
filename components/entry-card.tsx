import { Pressable, StyleSheet, Text, View } from "react-native";

import { useCognitiveWorkspace } from "@/hooks/use-cognitive-workspace";
import { formatDate, MirrorEntry, nextStep } from "@/lib/cognitive";
import { modeMeta } from "@/lib/i18n";

export function EntryCard({ entry, onPress }: { entry: MirrorEntry; onPress: () => void }) {
  const { state } = useCognitiveWorkspace();
  const meta = modeMeta(state.language, entry.mode);
  const step = nextStep(entry);
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}><View style={styles.top}><View style={[styles.dot, { backgroundColor: meta.accent }]} /><Text style={[styles.mode, { color: meta.accent }]}>{meta.label}</Text><Text style={styles.date}>{formatDate(entry.createdAt, state.language)}</Text></View><Text numberOfLines={2} style={styles.thought}>{entry.thought}</Text>{step ? <View style={styles.step}><Text style={styles.stepLabel}>{state.language === "bn" ? "একটি পরবর্তী পদক্ষেপ" : "ONE NEXT STEP"}</Text><Text numberOfLines={2} style={styles.stepText}>{step}</Text></View> : null}</Pressable>;
}

const styles = StyleSheet.create({ card: { backgroundColor: "#151D33", borderColor: "#26334E", borderRadius: 20, borderWidth: 1, gap: 10, marginBottom: 12, padding: 16 }, top: { alignItems: "center", flexDirection: "row", gap: 7 }, dot: { borderRadius: 5, height: 7, width: 7 }, mode: { fontSize: 11, fontWeight: "800", letterSpacing: 0.7 }, date: { color: "#74829D", fontSize: 11, marginLeft: "auto" }, thought: { color: "#F4F7FB", fontSize: 16, fontWeight: "600", lineHeight: 23 }, step: { backgroundColor: "#0D1426", borderRadius: 12, gap: 3, padding: 11 }, stepLabel: { color: "#69D6A3", fontSize: 10, fontWeight: "800", letterSpacing: 0.7 }, stepText: { color: "#C8D4E5", fontSize: 13, lineHeight: 18 }, pressed: { opacity: 0.72 } });
