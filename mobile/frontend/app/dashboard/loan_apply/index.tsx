import React from "react";
import { View, Text } from "react-native";
import { Stack } from "expo-router";

export default function LoanApply() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Stack.Screen options={{ title: "Apply for Loan" }} />

      <Text style={{ fontSize: 22, fontWeight: "600" }}>
        Loan Application
      </Text>

      <Text style={{ marginTop: 10 }}>
        Loan application form goes here.
      </Text>
    </View>
  );
}
