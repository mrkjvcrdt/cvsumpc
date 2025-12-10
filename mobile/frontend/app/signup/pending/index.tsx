import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function PendingScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 30,
      }}
    >
      <Text
        style={{
          fontSize: 26,
          fontWeight: "700",
          marginBottom: 20,
          textAlign: "center",
          color: "#006400",
        }}
      >
        Registration Submitted!
      </Text>

      <Text
        style={{
          fontSize: 16,
          textAlign: "center",
          marginBottom: 40,
          color: "#333",
        }}
      >
        Thank you for registering. Your account is now under review.  
        You will be notified once your registration is approved.
      </Text>

      {/* Button to go back to main screen */}
      <TouchableOpacity
        style={{
          backgroundColor: "#006400",
          paddingVertical: 14,
          paddingHorizontal: 40,
          borderRadius: 10,
          marginTop: 10,
        }}
        onPress={() => router.replace("/")}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
          Go to Main Screen
        </Text>
      </TouchableOpacity>
    </View>
  );
}
