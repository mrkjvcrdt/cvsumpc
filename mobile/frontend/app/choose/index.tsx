import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter, Stack } from "expo-router";

export default function ChooseScreen() {
  const router = useRouter();

  return (
    <>
      {/* Hide header */}
      <Stack.Screen options={{ headerShown: false }} />

      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          justifyContent: "space-between",
          padding: 30,
          paddingBottom: 50,
        }}
      >
        {/* Top Text Section */}
        <View style={{ alignItems: "center", marginTop: 100 }}>
          <Text
            style={{
              fontSize: 26,
              fontWeight: "bold",
              color: "#006400",
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            CvSUMPC Loan Application
          </Text>

          <Text
            style={{
              fontSize: 16,
              textAlign: "center",
              color: "#333",
              marginBottom: 40,
            }}
          >
            Manage your loans, payments, and account securely.
          </Text>
        </View>

        {/* Bottom Buttons */}
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#006400",
              paddingVertical: 15,
              borderRadius: 10,
              width: "90%",
              alignItems: "center",
              marginBottom: 15,
            }}
            onPress={() => router.push("/login")}
          >
            <Text
              style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
            >
              Log In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              borderColor: "#006400",
              borderWidth: 2,
              paddingVertical: 15,
              borderRadius: 10,
              width: "90%",
              alignItems: "center",
            }}
            onPress={() => router.push("./signup/phase1")}
          >
            <Text
              style={{ color: "#006400", fontWeight: "bold", fontSize: 16 }}
            >
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
