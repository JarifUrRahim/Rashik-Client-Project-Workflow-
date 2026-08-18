import { Pressable, StyleSheet, Text } from "react-native";

import { useCognitiveWorkspace } from "@/hooks/use-cognitive-workspace";
import { t } from "@/lib/i18n";

export function LanguageToggle() {
  const { state, setLanguage } = useCognitiveWorkspace();
  const next = state.language === "bn" ? "en" : "bn";
  return <Pressable accessibilityLabel="Switch app language" onPress={() => void setLanguage(next)} style={({ pressed }) => [styles.button, pressed && styles.pressed]}><Text style={styles.label}>{t(state.language, "switchLanguage")}</Text></Pressable>;
}
const styles = StyleSheet.create({ button: { alignItems: "center", backgroundColor: "#16223A", borderColor: "#3F5577", borderRadius: 12, borderWidth: 1, justifyContent: "center", minHeight: 34, paddingHorizontal: 10 }, label: { color: "#91ECF3", fontSize: 12, fontWeight: "900" }, pressed: { opacity: 0.72 } });
