import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Phase3() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await AsyncStorage.getItem("signup_phase1");
      setUserData(data ? JSON.parse(data) : null);
    };
    loadData();
  }, []);

  const handleFinish = async () => {
    await AsyncStorage.removeItem("signup_phase1");
    await AsyncStorage.removeItem("signup_verified");
    router.replace("/login");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 30, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", color: "#006400", marginBottom: 15 }}>
        Step 3: Pending Admin Validation
      </Text>

      <Text style={{ textAlign: "center", fontSize: 16, color: "#444", marginBottom: 30 }}>
        Your registration has been received. An administrator will review your
        information and approve your account shortly.
      </Text>

      {userData && (
        <Text style={{ textAlign: "center", color: "#666", marginBottom: 20 }}>
          <Text style={{ fontWeight: "bold" }}>Registered Email:</Text> {userData.email}
        </Text>
      )}

      <TouchableOpacity
        style={{
          backgroundColor: "#006400",
          padding: 15,
          borderRadius: 10,
          width: "80%",
          alignItems: "center",
        }}
        onPress={handleFinish}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Finish</Text>
      </TouchableOpacity>
    </View>
  );
}
