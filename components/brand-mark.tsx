import { Image, StyleSheet, Text, View } from "react-native";

import { LanguageToggle } from "@/components/language-toggle";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.row, compact && styles.compact]}>
      <Image source={require("@/assets/images/icon.png")} style={compact ? styles.smallIcon : styles.icon} />
      <View>
        <Text style={styles.parent}>RASHIK · THE AWAKENING</Text>
        <Text style={styles.model}>aWake</Text>
      </View>
      <View style={styles.toggle}><LanguageToggle /></View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: "center", flexDirection: "row", gap: 10 },
  compact: { gap: 8 },
  icon: { borderRadius: 18, height: 46, width: 46 },
  smallIcon: { borderRadius: 13, height: 34, width: 34 },
  parent: { color: "#8FA0BC", fontSize: 9, fontWeight: "800", letterSpacing: 0.8 },
  model: { color: "#F4F7FB", fontSize: 20, fontWeight: "800", letterSpacing: -0.4, marginTop: 1 },
  toggle: { marginLeft: "auto" },
});

