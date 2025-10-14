import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { TERMS_TEXT } from "./terms";

// Custom Checkbox
const CustomCheckBox = ({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (val: boolean) => void;
}) => (
  <TouchableOpacity
    onPress={() => onChange(!value)}
    style={{
      width: 24,
      height: 24,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 4,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {value && <View style={{ width: 16, height: 16, backgroundColor: "#006400" }} />}
  </TouchableOpacity>
);

export default function Phase2() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [phase1Data, setPhase1Data] = useState<any>(null);

  const API_HOST = "192.168.1.101"; // <-- CHANGE THIS WHEN TESTING
  const REGISTER_PENDING_URL = `http://${API_HOST}/cvsumpc/mobile/backend/signup/register_pending.php`;

  // Load Phase 1 data
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("signup_phase1");
      if (saved) setPhase1Data(JSON.parse(saved));
    })();
  }, []);

  const handleNext = async () => {
    if (!agreed) {
      Alert.alert("Agreement Required", "You must agree to the Terms & Conditions to continue.");
      return;
    }

    if (!phase1Data) {
      Alert.alert("Missing Data", "Phase 1 data not found. Please restart signup.");
      router.replace("/signup/phase1");
      return;
    }

    // Map Phase 1 + Phase 2 checkbox → pending_users table
    const allData = {
      ...phase1Data,
      terms_agreed: 1, // checkbox
      status: "Pending",
      remarks: "",
    };

    try {
      const response = await fetch(REGISTER_PENDING_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(allData),
      });

      const result = await response.json();

      if (result.success) {
        await AsyncStorage.setItem("pending_email", allData.email);
        await AsyncStorage.setItem("signup_phase2_completed", "true");
        router.push("/signup/pending");
      } else {
        Alert.alert("Signup Failed", result.message || "Please try again.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Network Error", `Unable to reach the server at ${REGISTER_PENDING_URL}`);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={{ flex: 1, backgroundColor: "white", padding: 20 }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: "#006400",
            marginBottom: 15,
            textAlign: "center",
          }}
        >
          Terms & Conditions – CvSUMPC Loan Application
        </Text>

        <ScrollView
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            padding: 10,
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 14, color: "#333", lineHeight: 20 }}>
            {TERMS_TEXT}
          </Text>
        </ScrollView>

        {/* Checkbox */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 80 }}>
          <CustomCheckBox value={agreed} onChange={setAgreed} />
          <Text style={{ marginLeft: 8 }}>I Agree to the Terms & Conditions</Text>
        </View>

        {/* Fixed Next Button */}
        <TouchableOpacity
          style={{
            backgroundColor: "#006400",
            padding: 15,
            borderRadius: 10,
            alignItems: "center",
            position: "absolute",
            bottom: 20,
            left: 20,
            right: 20,
          }}
          onPress={handleNext}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Next</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
