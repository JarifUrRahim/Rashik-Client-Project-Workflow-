import "../global.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useState } from "react";

import { CognitiveWorkspaceProvider } from "@/hooks/use-cognitive-workspace";
import { ThemeProvider } from "@/lib/theme-provider";
import { createTRPCClient, trpc } from "@/lib/trpc";

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => createTRPCClient());
  return <SafeAreaProvider><ThemeProvider><trpc.Provider client={trpcClient} queryClient={queryClient}><QueryClientProvider client={queryClient}><CognitiveWorkspaceProvider><StatusBar barStyle="light-content" /><Stack screenOptions={{ headerShown: false }} /></CognitiveWorkspaceProvider></QueryClientProvider></trpc.Provider></ThemeProvider></SafeAreaProvider>;
}
