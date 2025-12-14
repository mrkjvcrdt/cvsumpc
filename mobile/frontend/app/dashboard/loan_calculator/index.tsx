import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Stack } from "expo-router";
import { styles } from "./styles";
import { API_HOST } from "@/app/config";

// Images
import backArrow from "@/app/images/back-arrow.png";

interface LoanType {
  name: string;
  rate_percentage: number;
}

export default function LoanCalculator() {
  const router = useRouter();

  const [loanTypes, setLoanTypes] = React.useState<LoanType[]>([]);
  const [selectedLoanType, setSelectedLoanType] = React.useState<LoanType | null>(null);
  const [loanAmount, setLoanAmount] = React.useState("");
  const [tenure, setTenure] = React.useState("");
  const [rate_percentage, setRatePercentage] = React.useState("");

  useEffect(() => {
    const fetchLoanTypes = async () => {
      try {
        const response = await fetch(`http://${API_HOST}/cvsumpc/mobile/backend/dashboard/emi_calculator/fetch_loan_types.php`);
        const result = await response.json();
        if (result.success) {
          setLoanTypes(result.loan_types);
          if (result.loan_types.length > 0) {
            setSelectedLoanType(result.loan_types[0]);
            setRatePercentage(result.loan_types[0].rate_percentage.toString());
          }
        }
      } catch (error) {
        console.error("Error fetching loan types:", error);
      }
    };

    fetchLoanTypes();
  }, []);

  const handleLoanTypeChange = (LoanName: string) => {
    const loan = loanTypes.find((l) => l.name === LoanName);
    if (loan) {
      setSelectedLoanType(loan);
      setRatePercentage(loan.rate_percentage.toString());
    }
  };

  const handleBack = () => {
    router.replace("/dashboard"); // Go back to dashboard
  };

  {/* EMI CALCULATOR FORMULATION */}
  const [results, setResults] = React.useState<{
    breakdown: any[];
    totalPayment: string;
    totalInterest: string;
  } | null>(null);

  const calculateLoan = () => {
    if (!selectedLoanType) {
      alert("Please select a loan type.");
      return;
    }

    const principal = parseFloat(loanAmount);
    const months = parseInt(tenure);
    const rate = selectedLoanType.rate_percentage / 100;

    if (!principal || !months || months < 1 || months > 36) {
      alert("Please enter valid loan amount and tenure (1-36 months).");
    }

    const baseMonthly = principal / months;
    let balance = principal;

    let breakdown: any[] = [];
    let totalInterest = 0;
    let totalPayment = 0;

    let interest13to24 = 0;
    let interest25to36 = 0;

    for (let m = 1; m <= months; m++) {
      let interest = 0;
      if (m === 13) {
        interest13to24 = (balance / months) * rate;
      }
      if (m === 25) {
        interest25to36 = (balance / months) * rate;
      }

      if (m >= 13 && m <= 24) {
        interest = interest13to24;
      } else if (m >= 25) {
        interest = interest25to36;
      }

      const monthlyPayment = baseMonthly + interest;

      totalInterest += interest;
      totalPayment += monthlyPayment;

      breakdown.push({
        month: m,
        baseMonthly: baseMonthly.toFixed(2),
        interest: interest.toFixed(2),
        monthlyPayment: monthlyPayment.toFixed(2),
        balance: (balance - baseMonthly).toFixed(2),
      });
      balance -= baseMonthly;
    }

    setResults({
      breakdown,
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2)
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Image source={backArrow} style={styles.backIcon} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EMI Calculator</Text>
        {/* Placeholder for alignment */} 
        <View style={{ width: 40 }} />  
      </View>

      {/* Form */}
      <ScrollView contentContainerStyle={[styles.container, { padding : 20, paddingBottom: 120, }]}>
        {/* Loan Type Picker */}
        <Text style={styles.label}>Loan Type</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedLoanType?.name}
            onValueChange={(value) => handleLoanTypeChange(value)}
          >
            {loanTypes.map((loan) => (
              <Picker.Item key={loan.name} label={loan.name} value={loan.name} />
            ))}
          </Picker>
        </View>

        {/* Loan Amount */}
        <Text style={styles.label}>Loan Amount</Text>
        <TextInput
          style={styles.textInput}
          keyboardType="numeric"
          placeholder="Enter loan amount"
          value={loanAmount}
          onChangeText={setLoanAmount}
        />

        {/* Tenure */}
        <Text style={styles.label}>Tenure (months)</Text>
        <TextInput
          style={styles.textInput}
          keyboardType="numeric"
          placeholder="Enter tenure"
          value={tenure}
          onChangeText={setTenure}
        />

        {/* Interest Rate */}
        <Text style={styles.label}>Interest Rate (%)</Text>
        <TextInput
          style={[styles.textInput, { backgroundColor: "#e0e0e0" }]}
          value={rate_percentage}
          editable={false}
        />

        <TouchableOpacity
          style={styles.calculateButton}
          onPress={calculateLoan}
        >
          <Text style={styles.calculateButtonText}>Calculate</Text>
        </TouchableOpacity>
        
        {results && (
          <View style={{ marginTop: 20 }}>
            {/* Horizontal scroll for wide table */}
            <ScrollView horizontal showsHorizontalScrollIndicator>
              <View>
                {/* Table Header */}
                <View style={styles.tableHeader}>
                  <Text style={styles.tableHeaderText}>Month</Text>
                  <Text style={styles.tableHeaderText}>Base</Text>
                  <Text style={styles.tableHeaderText}>Interest</Text>
                  <Text style={styles.tableHeaderText}>Monthly</Text>
                  <Text style={styles.tableHeaderText}>Balance</Text>
                </View>

                {/* Table Rows */}
                {results.breakdown.map((row, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>M{row.month}</Text>
                    <Text style={styles.tableCell}>₱{row.baseMonthly}</Text>
                    <Text style={styles.tableCell}>₱{row.interest}</Text>
                    <Text style={styles.tableCell}>₱{row.monthlyPayment}</Text>
                    <Text style={styles.tableCell}>₱{row.balance}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
              
            {/* Totals */}
            <View style={styles.tableFooter}>
              <Text style={styles.footerText}>
                Total Interest: ₱{results.totalInterest}
              </Text>
              <Text style={styles.footerText}>
                Total Payment: ₱{results.totalPayment}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
