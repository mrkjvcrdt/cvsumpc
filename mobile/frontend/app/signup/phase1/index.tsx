import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { styles } from "./styles";

import eyeOpen from "../../images/eye_open.png";
import eyeClosed from "../../images/eye_close.png";

export default function Phase1() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const API_HOST = "192.168.1.101"; // CHANGE THIS BASED ON YOUR NETWORK

  // Password validation
  const validatePassword = (value: string) => {
    const minLength = /.{8,}/;
    const upper = /[A-Z]/;
    const lower = /[a-z]/;
    const number = /[0-9]/;
    const symbol = /[_@+\-#]/;

    if (!minLength.test(value)) return "Minimum 8 characters required.";
    if (!upper.test(value)) return "Must contain an uppercase letter.";
    if (!lower.test(value)) return "Must contain a lowercase letter.";
    if (!number.test(value)) return "Must contain a number.";
    if (!symbol.test(value)) return "Must contain a symbol (_, @, +, -, #).";

    return "";
  };

  const handleNext = async () => {
    setEmailError("");
    setPasswordError("");

    if (!email.trim()) {
      setEmailError("Email is required.");
      return;
    }

    if (!password.trim()) {
      setPasswordError("Password is required.");
      return;
    }

    const passwordCheck = validatePassword(password);
    if (passwordCheck !== "") {
      setPasswordError(passwordCheck);
      return;
    }

    const status = await checkEmailInDB();

    if (!status) {
      Alert.alert("Connection Error", "Failed to connect to server.");
      return;
    }

    // Email already exists
    if (status.exists) {
      if (status.status === "Approved") {
        setEmailError("Email is already in use.");
        return;
      }

      if (status.status === "Pending") {
        Alert.alert("Email Pending", "Email is waiting for approval.", [
          {
            text: "Close",
            onPress: () => {
              setEmail("");
              setPassword("");
            },
          },
        ]);
        return;
      }

      if (status.status === "Rejected") {
        Alert.alert("Email Rejected", "Email you used is rejected.", [
          {
            text: "Close",
            onPress: () => {
              setEmail("");
              setPassword("");
            },
          },
        ]);
        return;
      }
    }

    // Email does not exist → proceed
    await AsyncStorage.setItem(
      "signup_phase1",
      JSON.stringify({ email, password })
    );

    router.push("/signup/phase2");
  };

  const checkEmailInDB = async () => {
    try {
      const response = await fetch(
        `http://${API_HOST}/cvsumpc/mobile/backend/signup/check_email_status.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      return await response.json();
    } catch (error) {
      console.log("Error:", error);
      return null;
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
          <Text style={styles.title}>Create Your Account</Text>

          {/* EMAIL */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>

            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={(v) => {
                setEmail(v);
                setEmailError("");
              }}
              style={styles.textInput}
            />

            {emailError !== "" && (
              <Text style={styles.errorText}>{emailError}</Text>
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

          {/* NEXT BUTTON */}
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
