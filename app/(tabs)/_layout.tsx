import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCognitiveWorkspace } from "@/hooks/use-cognitive-workspace";
import { t } from "@/lib/i18n";

export default function TabLayout() {
  const insets = useSafeAreaInsets(); const { state } = useCognitiveWorkspace(); const bottom = Platform.OS === "web" ? 10 : Math.max(insets.bottom, 8); const language = state.language;
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: "#69D8E3", tabBarInactiveTintColor: "#7886A0", tabBarLabelStyle: { fontSize: language === "bn" ? 9 : 10, fontWeight: "700" }, tabBarStyle: { backgroundColor: "#111A2D", borderTopColor: "#26334E", height: 58 + bottom, paddingBottom: bottom, paddingTop: 7 } }}>
    <Tabs.Screen name="index" options={{ title: t(language, "mirror"), tabBarIcon: ({ color }) => <MaterialIcons color={color} name="auto-awesome" size={21} /> }} />
    <Tabs.Screen name="awake" options={{ title: "aWake", tabBarIcon: ({ color }) => <MaterialIcons color={color} name="forum" size={21} /> }} />
    <Tabs.Screen name="workspace" options={{ title: t(language, "workspace"), tabBarIcon: ({ color }) => <MaterialIcons color={color} name="dashboard" size={21} /> }} />
    <Tabs.Screen name="vault" options={{ title: t(language, "vault"), tabBarIcon: ({ color }) => <MaterialIcons color={color} name="shield" size={21} /> }} />
  </Tabs>;
}
