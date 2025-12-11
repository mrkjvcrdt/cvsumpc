import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./styles";

// Images
import cvsumpcLogo from "../images/cvsumpc.png"
import profileImage from "../images/profile.png";
import calculatorLogo from "../images/calculator.png";

export default function Dashboard() {
  const router = useRouter();
  const [accountId, setAccountId] = useState<number | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const sessionStr = await AsyncStorage.getItem("user_session");
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        setAccountId(session.account_id);
      } else {
        router.replace("/login");
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
      {/* Header with logo and profile */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={cvsumpcLogo} style={[styles.logo, { tintColor: "yellow" }]} resizeMode="contain" />
          <Text style={styles.logoLabel}>CVSUMPC</Text>
        </View>

        <View style={styles.rightIcons}>
          <View style={styles.iconWrapper}>
            <Image source={calculatorLogo} style={styles.iconImage} resizeMode="contain" />
          </View>
          <Image source={profileImage} style={styles.profile} resizeMode="contain" />
        </View>
      </View>

      {/* Main dashboard content */}
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
