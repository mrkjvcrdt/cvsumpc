import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./styles";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import { API_HOST } from "@/app/config";

// Images
import backArrow from "../../images/back-arrow.png";

export default function LoanApply() {
  const router = useRouter();
  const [accountId, setAccountId] = useState<number | null>(null);

  const [amount, setAmount] = useState("");
  const [tenure, setTenure] = useState("");
  const [payslip, setPayslip] = useState<string | null>(null);
  const [loanTypes, setLoanTypes] = useState<any[]>([]);
  const [selectedLoanType, setSelectedLoanType] = useState<number | null>(null);

  // Fetch account_id from AsyncStorage
  useEffect(() => {
    const getSession = async () => {
      const sessionStr = await AsyncStorage.getItem("user_session");
      if (!sessionStr) {
        router.replace("/login");
        return;
      }
      const session = JSON.parse(sessionStr);
      setAccountId(session.account_id);
    };
    getSession();
  }, []);

  // Fetch loan types
  useEffect(() => {
    const fetchLoanTypes = async () => {
      try {
        const response = await fetch(
          `http://${API_HOST}/cvsumpc/mobile/backend/dashboard/loan_apply/fetch_loan_types.php`
        );
        const result = await response.json();
        if (result.success) {
          setLoanTypes(result.loan_types);
        }
      } catch (error) {
        console.log("Failed to fetch loan types:", error);
      }
    };
    fetchLoanTypes();
  }, []);

  // Pick payslip with proper type checking
  const pickPayslip = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "image/*", copyToCacheDirectory: true });

    if (!result.canceled) {
      const selectedFile = result.assets[0];
      setPayslip(selectedFile.uri);
    }
  };

  // Submit loan application
  const submitApplication = async () => {
    if (!accountId || !selectedLoanType || !amount || !tenure || !payslip) {
      alert("Please fill in all fields and upload your payslip.");
      return;
    }

    const formData = new FormData();
    formData.append("account_id", accountId.toString());
    formData.append("type_id", selectedLoanType.toString());
    formData.append("amount", amount);
    formData.append("tenure", tenure);

    // Append payslip file
    const fileName = payslip.split("/").pop() || `payslip_${Date.now()}.jpg`;
    formData.append("payslip", {
      uri: payslip,
      type: "image/jpeg",
      name: fileName,
    } as any);

    try {
      const response = await fetch(
        `http://${API_HOST}/cvsumpc/mobile/backend/dashboard/loan_apply/submit_loan_application.php`,
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        alert("Loan application submitted successfully.");
        router.back();
      } else {
        alert(result.message || "Failed to submit loan application.");
      }
    } catch (error) {
      console.log("Error submitting loan application:", error);
      alert("An error occurred while submitting your application.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* TOP BAR */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Image source={backArrow} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Apply Loan</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
        {/* LOAN TYPE */}
        <Text style={styles.label}>Loan Type</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedLoanType}
            onValueChange={(value) => setSelectedLoanType(value)}
          >
            <Picker.Item label="Select Loan Type" value={null} />
            {loanTypes.map((type) => (
              <Picker.Item
                key={type.type_id}
                label={`${type.name} (${type.rate_percentage}% interest)`}
                value={type.type_id}
              />
            ))}
          </Picker>
        </View>

        {/* AMOUNT */}
        <Text style={styles.label}>Loan Amount</Text>
        <TextInput
          placeholder="Enter amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          style={styles.textInput}
        />

        {/* TENURE */}
        <Text style={styles.label}>Tenure (Months)</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={tenure}
            onValueChange={(value) => setTenure(value)}
          >
            <Picker.Item label="Select Tenure" value={null} />
            {[6, 12, 18, 24, 30, 36].map((month) => (
              <Picker.Item
                key={month}
                label={`${month} Months`}
                value={month.toString()}
              />
            ))}
          </Picker>
        </View>

        {/* PAYSLIP */}
        <Text style={styles.label}>Payslip</Text>
        <TouchableOpacity style={styles.uploadBox} onPress={pickPayslip}>
          <Text style={styles.uploadText}>
            {payslip ? "Payslip Selected" : "Upload Payslip"}
          </Text>
        </TouchableOpacity>

        {/* File Name */}
        {payslip && (
          <Text style={{ marginTop: 5, color: "#fff" }}>
            {payslip.split("/").pop()}
          </Text>
        )}

        {/* SUBMIT */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={submitApplication}
        >
          <Text style={styles.submitText}>Submit Application</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
