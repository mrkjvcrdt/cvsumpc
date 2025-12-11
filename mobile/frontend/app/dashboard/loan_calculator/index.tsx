import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Stack } from "expo-router";
import { styles } from "./styles";

// Optional: you can use an emoji or import an image for the back arrow
import backArrow from "@/app/images/back-arrow.png";

export default function LoanCalculator() {
  const router = useRouter();

  const handleBack = () => {
    router.replace("/dashboard"); // Go back to dashboard
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Image source={backArrow} style={styles.backIcon} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Loan Calculator</Text>
        {/* Placeholder for alignment */} 
        <View style={{ width: 40 }} />  
      </View>

      {/* Main Content */}
      <View style={styles.container}>
        <Text style={styles.infoText}>
          Loan Calculator Page - UI and logic to be implemented.
        </Text>
      </View>
    </SafeAreaView>
  );
}
