import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "./styles";
import { API_HOST } from "../config";

import eyeOpen from "../images/eye_open.png";
import eyeClosed from "../images/eye_close.png";

export default function Login() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState(""); // email or phone
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false)
  const [identifierError, setIdentifierError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = async () => {
    setIdentifierError("");
    setPasswordError("");

    if (!identifier.trim() || !password.trim()) {
      setIdentifierError("Enter email/phone and password");
      return;
    }

    setLoading(true);
    try {
      const LOGIN_URL = `http://${ API_HOST }/cvsumpc/mobile/backend/login/login.php`;
      const response = await fetch(LOGIN_URL,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier, password }),
        }
      );

      const result = await response.json();
      if (!result.success) {
        if (result.message.toLowerCase().includes("password")) {
          setPasswordError(result.message);
        } else {
          setIdentifierError(result.message)
        }
        return;
      }

      //Save login session
      await AsyncStorage.setItem(
        "user_session",
        JSON.stringify({ account_id: result.account_id, PIN_set: result.PIN_set })
      );

      if (!result.PIN_set) {
        router.push("/PIN/pin_setup"); // First login -> setup PIN
      } else {
        router.replace("/PIN"); // Already has PIN -> Enter PIN
      }
    } catch (err) {
      setIdentifierError("Network error. Please try again.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Login to CVSUMPC Loan App</Text>

          {/* EMAIL / PHONE */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email or Phone Number</Text>
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              value={identifier}
              onChangeText={(v) => {
                setIdentifier(v);
                setIdentifierError("");
              }}
              style={styles.textInput}
            />
            {identifierError !== "" && (
              <Text style={styles.errorText}>{identifierError}</Text>
            )}
          </View>

          {/* PASSWORD */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>

            <View style={styles.passwordWrapper}>
              <TextInput
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                value={password}
                onChangeText={(v) => {
                  setPassword(v);
                  setPasswordError("");
                }}
                style={styles.passwordInput}
              />

              {/* Eye toggle button */}
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.passwordToggle}
              >
                <Image
                  source={showPassword ? eyeOpen : eyeClosed}
                  style={styles.passwordIcon}
                />
              </TouchableOpacity>
            </View>

            {passwordError !== "" && (
              <Text style={styles.errorText}>{passwordError}</Text>
            )}
          </View>

          {/* LOGIN BUTTON */}
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleLogin}
          >
            <Text style={styles.nextButtonText}>Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
