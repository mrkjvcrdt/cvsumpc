import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  StatusBar,
  Platform,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { styles } from "./styles";

export default function Phase2() {
  const router = useRouter();
  const [phase1Data, setPhase1Data] = useState<any>(null);

  const [form, setForm] = useState({
    last_name: "",
    first_name: "",
    middle_name: "",
    suffix: "",
    contact_number: "",
    gender: "",
    nationality: "",
    birthday: "",
    street: "",
    barangay: "",
    municipality: "",
    province: "",
    zipcode: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [genderModalVisible, setGenderModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("signup_phase1");
      if (saved) setPhase1Data(JSON.parse(saved));
    })();
  }, []);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = async () => {
    const newErrors: any = {};

    ["last_name", "first_name", "contact_number", "nationality", "barangay", "municipality", "province", "zipcode"].forEach(
      (key) => {
        if (!form[key as keyof typeof form].trim()) {
          newErrors[key] = "Required";
        }
      }
    );

    if (form.contact_number && !/^\d+$/.test(form.contact_number)) {
      newErrors.contact_number = "Numbers only";
    }
    if (form.zipcode && !/^\d+$/.test(form.zipcode)) {
      newErrors.zipcode = "Numbers only";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await AsyncStorage.setItem("signup_phase2", JSON.stringify(form));
    router.push("/signup/phase3");
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={{ flex: 1,
        backgroundColor: "white",}}>
          <StatusBar
            barStyle="light-content"
            backgroundColor="black"
            translucent={false}
          />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>Personal Information</Text>

            {[
              ["Last Name", "last_name"],
              ["First Name", "first_name"],
              ["Middle Name", "middle_name"],
              ["Suffix", "suffix"],
              ["Contact Number", "contact_number"],
              ["Gender (Male/Female)", "gender"],
              ["Nationality", "nationality"],
              ["Birthday (YYYY-MM-DD)", "birthday"],
              ["Street", "street"],
              ["Barangay", "barangay"],
              ["Municipality", "municipality"],
              ["Province", "province"],
              ["ZIP Code", "zipcode"],
            ].map(([label, key]) => {
              if (key === "gender") {
                return (
                  <View key={key} style={styles.inputContainer}>
                    <Text style={styles.label}>{label}</Text>
                    <TouchableOpacity
                      onPress={() => setGenderModalVisible(true)}
                      style={styles.textInput}
                    >
                      <Text>
                        {form.gender ? form.gender : "Select Gender"}
                      </Text>
                    </TouchableOpacity>

                    {errors.gender && (
                      <Text style={styles.errorText}>{errors.gender}</Text>
                    )}

                    <Modal
                      transparent
                      visible={genderModalVisible}
                      animationType="fade"
                    >
                      <TouchableWithoutFeedback
                        onPress={() => setGenderModalVisible(false)}
                      >
                        <View style={styles.modalOverlay} />
                      </TouchableWithoutFeedback>
                      <View style={styles.modalContent}>
                        {["Male", "Female"].map((g) => (
                          <TouchableOpacity
                            key={g}
                            onPress={() => {
                              handleChange("gender", g);
                              setGenderModalVisible(false);
                            }}
                            style={styles.modalOption}
                          >
                            <Text style={styles.modalOptionText}>{g}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </Modal>
                  </View>
                );
              } else {
                return (
                  <View key={key} style={styles.inputContainer}>
                    <Text style={styles.label}>{label}</Text>
                    <TextInput
                      value={form[key as keyof typeof form]}
                      onChangeText={(v) => handleChange(key, v)}
                      style={styles.textInput}
                      keyboardType={
                        key === "contact_number" || key === "zipcode"
                          ? "numeric"
                          : "default"
                      }
                      autoCapitalize="words"
                    />
                    {errors[key as keyof typeof errors] && (
                      <Text style={styles.errorText}>
                        {errors[key as keyof typeof errors]}
                      </Text>
                    )}
                  </View>
                );
              }
            })}

            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}
