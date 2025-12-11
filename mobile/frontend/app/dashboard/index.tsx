import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./styles";

export default function Dashboard() {
  const router = useRouter();
  const [accountId, setAccountId] = useState<number | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const sessionStr = await AsyncStorage.getItem("user_session");
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        setAccountId(session.account_id);
      }
    };
    getSession();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user_session");
    await AsyncStorage.removeItem("user_PIN");
    router.replace("/login");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Dashboard!</Text>

        {accountId && (
          <Text style={styles.accountText}>Your Account ID: {accountId}</Text>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
