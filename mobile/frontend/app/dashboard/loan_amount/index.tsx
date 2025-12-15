import React from "react";
import { View, Text } from "react-native";
import { styles } from "../styles";

export default function LoanAmountWidget() {
  return (
    <>
      <Text style={styles.widgetTitle}>Total Loan</Text>
      <Text style={styles.widgetAmount}>₱ 0.00</Text>
      <Text style={styles.widgetSubText}>
        Active loans balance
      </Text>
    </>
  );
}
