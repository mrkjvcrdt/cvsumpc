import React, { useEffect, useState } from "react";
import { Text, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../styles";
import { API_HOST } from "../../config";

export default function SavingsWidget() {
  const [currentBalance, setCurrentBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      const sessionStr = await AsyncStorage.getItem("user_session");
      if (!sessionStr) return;

      const session = JSON.parse(sessionStr);
      const accountId = session.account_id;

      try {
        const response = await fetch(
          `http://${API_HOST}/cvsumpc/mobile/backend/dashboard/savings_widget/fetch_current_savings.php`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ account_id: accountId }),
          }
        );
        const result = await response.json();

        if (result.success) {
          setCurrentBalance(parseFloat(result.current_balance));
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  if (loading) {
    return <ActivityIndicator size="small" color="#006400" />;
  }

  if (currentBalance === null) {
    return <Text style={styles.widgetSubText}>No active savings account</Text>;
  }

  return (
    <>
      <Text style={styles.widgetTitle}>Savings Amount</Text>
      <Text style={styles.widgetAmount}>
        ₱ {currentBalance.toFixed(2)}
      </Text>
      <Text style={styles.widgetSubText}>
        Current savings balance
      </Text>
    </>
  );
}
