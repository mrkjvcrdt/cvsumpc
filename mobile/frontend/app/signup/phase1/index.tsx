import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, Stack } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { styles } from "./styles";

export default function Phase1() {
  const router = useRouter();
  const [form, setForm] = useState({
    last_name: "",
    first_name: "",
    middle_name: "",
    suffix: "",
    sex: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    email: "",
    street: "",
    barangay: "",
    municipality: "",
    province: "",
    zip_code: "",
  });

  const handleChange = (key: string, value: string) => {
    let filteredValue = value;

    if (["last_name", "first_name", "middle_name", "suffix"].includes(key)) {
      filteredValue = value.replace(/[^a-zA-Z\s]/g, "");
    }
    if (["zip_code", "birthYear", "birthMonth", "birthDay"].includes(key)) {
      filteredValue = value.replace(/[^0-9]/g, "");
    }
    if (["street", "barangay", "municipality", "province"].includes(key)) {
      filteredValue = value.replace(/[^a-zA-Z0-9\s]/g, "");
    }

    setForm((prev) => ({ ...prev, [key]: filteredValue }));
  };

  const handleNext = async () => {
    const required = [
      "last_name",
      "first_name",
      "email",
      "sex",
      "birthYear",
      "birthMonth",
      "birthDay",
    ];

    for (const field of required) {
      if (!form[field as keyof typeof form]) {
        Alert.alert("Missing Info", `Please fill out the ${field} field.`);
        return;
      }
    }

    // Validate birthday
    const year = parseInt(form.birthYear, 10);
    const month = parseInt(form.birthMonth, 10);
    const day = parseInt(form.birthDay, 10);

    if (year < 1900 || year > new Date().getFullYear()) {
      Alert.alert("Invalid Date", "Please enter a valid year.");
      return;
    }
    if (month < 1 || month > 12) {
      Alert.alert("Invalid Date", "Month must be between 1 and 12.");
      return;
    }
    if (day < 1 || day > 31) {
      Alert.alert("Invalid Date", "Day must be between 1 and 31.");
      return;
    }

    // Combine birthday
    const birthday = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;

    const savedData = { ...form, birthday };
    await AsyncStorage.setItem("signup_phase1", JSON.stringify(savedData));

    router.push("/signup/phase2");
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView
          style={styles.container}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          <Text style={styles.title}>Personal & Address Information</Text>

          {/* Name Fields */}
          {[
            ["Last Name", "last_name"],
            ["First Name", "first_name"],
            ["Middle Name", "middle_name"],
            ["Suffix (optional)", "suffix"],
          ].map(([label, key]) => (
            <View key={key} style={styles.inputContainer}>
              <Text style={styles.label}>{label}</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={(v: string) => handleChange(key, v)}
                value={form[key as keyof typeof form]}
              />
            </View>
          ))}

          {/* Sex Dropdown */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Sex</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={form.sex}
                onValueChange={(v) => handleChange("sex", v)}
              >
                <Picker.Item label="Select Sex" value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
              </Picker>
            </View>
          </View>

          {/* Birthday Fields */}
          <Text style={styles.label}>Birthday</Text>
          <View style={styles.birthdayContainer}>
            <TextInput
              placeholder="YYYY"
              keyboardType="numeric"
              maxLength={4}
              style={[styles.birthdayInput, styles.birthdayInputYear]}
              onChangeText={(v: string) => handleChange("birthYear", v)}
              value={form.birthYear}
            />
            <TextInput
              placeholder="MM"
              keyboardType="numeric"
              maxLength={2}
              style={[styles.birthdayInput, styles.birthdayInputMonth]}
              onChangeText={(v: string) => handleChange("birthMonth", v)}
              value={form.birthMonth}
            />
            <TextInput
              placeholder="DD"
              keyboardType="numeric"
              maxLength={2}
              style={[styles.birthdayInput, styles.birthdayInputDay]}
              onChangeText={(v: string) => handleChange("birthDay", v)}
              value={form.birthDay}
            />
          </View>

          {/* Other Fields */}
          {[
            ["Email Address", "email"],
            ["Street", "street"],
            ["Barangay", "barangay"],
            ["Municipality / City", "municipality"],
            ["Province", "province"],
            ["ZIP Code", "zip_code"],
          ].map(([label, key]) => (
            <View key={key} style={styles.inputContainer}>
              <Text style={styles.label}>{label}</Text>
              <TextInput
                keyboardType={
                  key === "zip_code"
                    ? "numeric"
                    : key === "email"
                    ? "email-address"
                    : "default"
                }
                autoCapitalize={key === "email" ? "none" : "words"}
                style={styles.textInput}
                onChangeText={(v: string) => handleChange(key, v)}
                value={form[key as keyof typeof form]}
              />
            </View>
          ))}

          {/* Next Button */}
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
