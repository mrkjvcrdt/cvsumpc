import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { styles } from "./styles";

export default function PinLogin() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handlePress = async (num: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + num;
    setPin(newPin);

    if (newPin.length === 4) {
      const storedPIN = await AsyncStorage.getItem("user_PIN");

      if (storedPIN === newPin) {
        router.replace("/dashboard");
      } else {
        setError("Incorrect PIN. Try again.");
        setPin("");
      }
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const renderDots = () => (
    <View style={styles.pinDotsContainer}>
      {[0, 1, 2, 3].map((i) => (
        <View
          key={i}
          style={[
            styles.pinDot,
            i < pin.length ? styles.pinDotFilled : null,
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter PIN</Text>
      <Text style={styles.subtitle}>Your 4-digit login PIN</Text>

      {error !== "" && <Text style={styles.error}>{error}</Text>}

      {renderDots()}

      {/* NUMPAD */}
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
  );
}
