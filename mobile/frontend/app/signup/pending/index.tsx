import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, Stack } from "expo-router";

export default function PendingApproval() {
  const router = useRouter();
  const [status, setStatus] = useState<"pending" | "approved" | "rejected">("pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      const email = await AsyncStorage.getItem("pending_email");
      if (!email) return;

      try {
        const res = await fetch("http://localhost/mobile/backend/signup/check_status.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const result = await res.json();
        if (result.status) setStatus(result.status);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();

    // Optional: recheck every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    if (loading)
      return (
        <View style={{ alignItems: "center", marginTop: 50 }}>
          <ActivityIndicator size="large" color="#006400" />
          <Text style={{ marginTop: 10 }}>Checking your approval status...</Text>
        </View>
      );

    if (status === "pending")
      return (
        <View style={{ alignItems: "center", marginTop: 50 }}>
          <Text style={{ fontSize: 18, color: "#555", textAlign: "center", marginBottom: 30 }}>
            Your account is awaiting approval from the admin.  
            Please check back later.
          </Text>
        </View>
      );

    if (status === "approved")
      return (
        <View style={{ alignItems: "center", marginTop: 50 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#006400", marginBottom: 10 }}>
            ✅ Approved!
          </Text>
          <Text style={{ fontSize: 16, color: "#333", marginBottom: 30 }}>
            Your account has been approved.
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#006400",
              padding: 15,
              borderRadius: 10,
              width: "80%",
              alignItems: "center",
            }}
            onPress={() => router.push("./signup/phase3")}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Finish Setting Up</Text>
          </TouchableOpacity>
        </View>
      );

    if (status === "rejected")
      return (
        <View style={{ alignItems: "center", marginTop: 50 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#b00000", marginBottom: 10 }}>
            ❌ Rejected
          </Text>
          <Text style={{ fontSize: 16, color: "#333", marginBottom: 30 }}>
            Your registration was rejected. Please contact support or try again.
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#b00000",
              padding: 15,
              borderRadius: 10,
              width: "80%",
              alignItems: "center",
            }}
            onPress={() => router.push("../choose")}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Return</Text>
          </TouchableOpacity>
        </View>
      );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={{ flex: 1, backgroundColor: "white", padding: 20 }}>
        {renderContent()}
      </ScrollView>
    </>
  );
}
