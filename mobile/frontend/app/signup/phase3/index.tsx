import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { styles } from "./styles";
import { TERMS_TEXT } from "./terms";
import { API_HOST } from "@/app/config";

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
    style={styles.checkbox}
  >
    {value && <View style={styles.checkboxChecked} />}
  </TouchableOpacity>
);

export default function Phase3() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [phase1Data, setPhase1Data] = useState<any>(null);
  const [phase2Data, setPhase2Data] = useState<any>(null);

  const REGISTER_ACCOUNT_URL = `http://${API_HOST}/cvsumpc/mobile/backend/signup/register_account.php`;

  // Load Phase 1 and Phase 2 data
  useEffect(() => {
    (async () => {
      const savedPhase1 = await AsyncStorage.getItem("signup_phase1");
      const savedPhase2 = await AsyncStorage.getItem("signup_phase2");
      if (savedPhase1) setPhase1Data(JSON.parse(savedPhase1));
      if (savedPhase2) setPhase2Data(JSON.parse(savedPhase2));
    })();
  }, []);

  const handleSubmit = async () => {
    if (!agreed) {
      Alert.alert("Agreement Required", "You must agree to the Terms & Conditions to continue.");
      return;
    }

    if (!phase1Data || !phase2Data) {
      Alert.alert("Missing Data", "Phase 1 or Phase 2 data not found. Please restart signup.");
      router.replace("/signup/phase1");
      return;
    }

    const allData = {
      ...phase1Data,
      ...phase2Data,
      terms_agreed: 1,
      status: "Pending",
      remarks: "",
    };

    try {
      const response = await fetch(REGISTER_ACCOUNT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(allData),
      });
    
      const text = await response.text(); // get raw text first
      let result;
    
      try {
        result = JSON.parse(text); // try parsing JSON
      } catch (err) {
        console.error("Server did not return JSON:", text);
        Alert.alert("Server Error", "Invalid response from server.");
        return;
      }
    
      if (result.success) {
        Alert.alert("Success", "Your account has been submitted.");
        router.push("/signup/pending");
      } else {
        Alert.alert("Error", result.message || "Signup failed.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Network Error", `Unable to reach the server at ${REGISTER_ACCOUNT_URL}`);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        >
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Terms & Conditions – CvSUMPC Loan Application</Text>

            <ScrollView
              style={styles.termsContainer}
              contentContainerStyle={{ padding: 10 }}
            >
              <Text style={styles.termsText}>{TERMS_TEXT}</Text>
            </ScrollView>

            <View style={styles.checkboxWrapper}>
              <CustomCheckBox value={agreed} onChange={setAgreed} />
              <Text style={{ marginLeft: 8 }}>I Agree to the Terms & Conditions</Text>
            </View>

            <TouchableOpacity style={styles.nextButton} onPress={handleSubmit}>
              <Text style={styles.nextButtonText}>Submit</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}
