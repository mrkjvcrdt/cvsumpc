import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";

export default function Layout() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      const completed = await AsyncStorage.getItem("onboardingComplete");
      setInitialRoute(completed ? "choose/index" : "onboarding/index");
      // setInitialRoute("onboarding/index");
    };
    checkOnboarding();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#006400" />
      </View>
    );
  }

  return (
    <Stack initialRouteName={initialRoute}>
      <Stack.Screen name="onboarding/index" options={{ headerShown: false }} />
      <Stack.Screen name="login/index" options={{ headerShown: false }} />
      <Stack.Screen name="signup/pending/index" options={{ headerShown: false }} />
      <Stack.Screen name="signup/phase1/index" options={{ title: "Sign Up - Step 1" }} />
      <Stack.Screen name="signup/phase2/index" options={{ title: "Sign Up - Step 2" }} />
      <Stack.Screen name="signup/phase3/index" options={{ title: "Sign Up - Step 3" }} />
      <Stack.Screen name="terms/index" options={{ title: "User Agreement" }} />
    </Stack>
  );
}
