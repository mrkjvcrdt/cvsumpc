import React, { useEffect, useState, useRef } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image,
  ScrollView,
  Dimensions,
 } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./styles";

// Images
import cvsumpcLogo from "../images/cvsumpc.png"
import profileImage from "../images/profile.png";
import calculatorLogo from "../images/calculator.png";

// Dashboard Component
import SavingsWidget from "./savings_widget";
import LoanAmountWidget from "./loan_amount";

const { width } = Dimensions.get("window");

export default function Dashboard() {
  const router = useRouter();
  const [accountId, setAccountId] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const getSession = async () => {
      const sessionStr = await AsyncStorage.getItem("user_session");
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        setAccountId(session.account_id);
      } else {
        router.replace("/login");
      }
    };
    getSession();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user_session");
    await AsyncStorage.removeItem("user_PIN");
    router.replace("/login");
  };

  const handleScroll = (event: any) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / width
    );
    setActiveIndex(index);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header with logo and profile */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={cvsumpcLogo} style={[styles.logo, { tintColor: "#ffbf00" }]} resizeMode="contain" />
          <Text style={styles.logoLabel}>CVSUMPC</Text>
        </View>

        <View style={styles.rightIcons}>
          <TouchableOpacity style={styles.iconWrapper} onPress={() => router.push("/dashboard/loan_calculator")}>
            <Image source={calculatorLogo} style={styles.iconImage} resizeMode="contain" />
          </TouchableOpacity>
          <Image source={profileImage} style={styles.profile} resizeMode="contain" />
        </View>
      </View>

      {/* Main dashboard content */}
      <View>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View style={[styles.widgetContainer, { width }]}>
            <View style={styles.widgetFrame}>
              <SavingsWidget />
            </View>
          </View>

          <View style={[styles.widgetContainer, { width }]}>
            <View style={styles.widgetFrame}>
              <LoanAmountWidget />
            </View>
          </View>
        </ScrollView>

        {/* Dots Indicator */}
        <View style={styles.dotsContainer}>
          {[0, 1].map((i) => (
            <View
              key={i}
              style={[
                styles.dot,
                activeIndex === i && styles.activeDot,
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Dashboard!</Text>

        {accountId && (
          <Text style={styles.accountText}>
            Your Account ID: {accountId}
          </Text>
        )}

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
