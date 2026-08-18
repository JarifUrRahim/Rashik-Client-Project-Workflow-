import "./scripts/load-env.js";
import type { ExpoConfig } from "expo/config";

const rawBundleId = "com.app.onecognitivemirror";
const bundleId = rawBundleId.replace(/[-_]/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.+|\.+$/g, "").toLowerCase() || "space.manus.app";

const env = {
  appName: "ONE",
  appSlug: "one-cognitive-mirror",
  logoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663213348894/ScXVaaxfFAUQMRze.png",
  scheme: "onecognitivemirror",
  iosBundleId: bundleId,
  androidPackage: bundleId,
};

const config: ExpoConfig = {
  name: env.appName,
  slug: env.appSlug,
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: env.scheme,
  userInterfaceStyle: "dark",
  newArchEnabled: true,
  ios: { supportsTablet: true, bundleIdentifier: env.iosBundleId, infoPlist: { ITSAppUsesNonExemptEncryption: false } },
  android: {
    adaptiveIcon: { backgroundColor: "#0B1020", foregroundImage: "./assets/images/android-icon-foreground.png", backgroundImage: "./assets/images/android-icon-background.png", monochromeImage: "./assets/images/android-icon-monochrome.png" },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    softwareKeyboardLayoutMode: "resize",
    package: env.androidPackage,
    permissions: ["POST_NOTIFICATIONS"],
  },
  web: { bundler: "metro", output: "static", favicon: "./assets/images/favicon.png" },
  plugins: ["expo-router", ["expo-splash-screen", { image: "./assets/images/splash-icon.png", imageWidth: 200, resizeMode: "contain", backgroundColor: "#0B1020", dark: { backgroundColor: "#0B1020" } }], ["expo-build-properties", { android: { buildArchs: ["armeabi-v7a", "arm64-v8a"], minSdkVersion: 24 } }]],
  experiments: { typedRoutes: true, reactCompiler: true },
};

export default config;
