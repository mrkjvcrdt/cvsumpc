import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, Stack } from "expo-router";
import { styles } from "./styles";
import { API_HOST } from "../config";

export default function PinLogin() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  // Get account_id from session
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

  const handlePress = async (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);

      if (newPin.length === 4) {
        if (!accountId) {
          setError("Account ID missing.");
          return;
        }

        // Validate PIN
        const FETCH_PIN_URL = `http://${API_HOST}/cvsumpc/mobile/backend/login/fetch_PIN.php`;
        try {
          const response = await fetch(FETCH_PIN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ account_id: accountId, pin: newPin }),
          });

          const resultText = await response.text();
          console.log("Raw PIN response:", resultText);
          const result = JSON.parse(resultText);

          if (result.success) {
            await AsyncStorage.setItem("user_PIN", newPin);
            router.replace("/dashboard");
          } else {
            setError(result.message || "Incorrect PIN.");
            setPin("");
          }
        } catch (err) {
          console.log("Fetch error:", err);
          setError("Network error. Try again.");
          setPin("");
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const renderDots = () => {
    return (
      <View style={styles.pinDotsContainer}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[styles.pinDot, i < pin.length ? styles.pinDotFilled : null]}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <Text style={styles.title}>Enter your PIN</Text>
        {error !== "" && <Text style={styles.error}>{error}</Text>}
        {renderDots()}

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
