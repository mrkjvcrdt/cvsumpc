import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";

import { API_HOST } from "../config";

export default function PinSetup() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const handlePress = async (num: string) => {
    if (step === 1 && pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) setStep(2);
      return;
    }
  
    if (step === 2 && confirmPin.length < 4) {
      const newConfirm = confirmPin + num;
      setConfirmPin(newConfirm);
  
      if (newConfirm.length === 4) {
        if (newConfirm !== pin) {
          setError("PINs do not match. Try again.");
          setPin("");
          setConfirmPin("");
          setStep(1);
          return;
        }
  
        // --- Correctly get account_id from AsyncStorage ---
        const sessionStr = await AsyncStorage.getItem("user_session");
        if (!sessionStr) {
            setError("User session not found.");
            return;
        }

        const session = JSON.parse(sessionStr);
        const account_id = session.account_id;

        if (!account_id) {
            setError("Account ID missing in session");
            return;
        }
  
        // --- Send PIN to backend ---
        const PIN_URL = `http://${API_HOST}/cvsumpc/mobile/backend/login/update_PIN.php`;
  
        try {
          const response = await fetch(PIN_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ account_id, pin }),
          });
  
          const responseText = await response.text();
          console.log("Raw response:", responseText);
  
          const result = JSON.parse(responseText);
  
          if (result.success) {
            await AsyncStorage.setItem("user_PIN", pin);
            router.replace("/dashboard");
          } else {
            setError(result.message || "Failed to save PIN. Try again.");
          }
        } catch (err) {
          console.log("Fetch error:", err);
          setError("Network error. Try again.");
        }
      }
    }
  };
  

  const handleBackspace = () => {
    if (step === 1) setPin(pin.slice(0, -1));
    else setConfirmPin(confirmPin.slice(0, -1));
  };

  const renderDots = (count: number) => {
    return (
      <View style={styles.pinDotsContainer}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.pinDot,
              i < count ? styles.pinDotFilled : null,
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />

        <Text style={styles.title}>
          {step === 1 ? "Set Your PIN" : "Confirm PIN"}
        </Text>

        <Text style={styles.subtitle}>
          {step === 1 ? "Enter a 4-digit PIN" : "Re-enter your 4-digit PIN"}
        </Text>

        {error !== "" && <Text style={styles.error}>{error}</Text>}

        {renderDots(step === 1 ? pin.length : confirmPin.length)}

        <View style={styles.keypadContainer}>
          {[["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"]].map((row) => (
            <View style={styles.keypadRow} key={row.join("")}>
              {row.map((num) => (
                <TouchableOpacity
                  key={num}
                  style={styles.keyButton}
                  onPress={() => handlePress(num)}
                >
                  <Text style={styles.keyText}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}

          <View style={styles.keypadRow}>
            <View style={{ width: 75 }} />

            <TouchableOpacity
              style={styles.keyButton}
              onPress={() => handlePress("0")}
            >
              <Text style={styles.keyText}>0</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backspaceBtn}
              onPress={handleBackspace}
            >
              <Text style={styles.backspaceText}>⌫</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
