import React, { useEffect, useState, useRef } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image,
  ScrollView,
  Dimensions,
  Animated,
  Pressable,
 } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./styles";
import { API_HOST } from "../config";

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

  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string>("");

  const slideAnim = useRef(new Animated.Value(width)).current;

  const fetchAccountInfo = async (accountId: number) => {
  try {
    const response = await fetch(
      `http://${ API_HOST }/cvsumpc/mobile/backend/dashboard/fetch_account_info.php`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_id: accountId }),
      }
    );

    const result = await response.json();

    if (result.success) {
      const suffix = result.suffix ? ` ${result.suffix}` : "";
      setUserName(`${result.last_name}${suffix}, ${result.first_name}`);
    }
  } catch (error) {
    console.log("Failed to fetch account info:", error);
  }
};


  useEffect(() => {
    const getSession = async () => {
      const sessionStr = await AsyncStorage.getItem("user_session");

      if (!sessionStr) {
        router.replace("/login");
        return;
      }
        console.log("SESSION DATA: ", sessionStr);

        const session = JSON.parse(sessionStr);
        setAccountId(session.account_id);
        fetchAccountInfo(session.account_id);
    };
    getSession();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user_session");
    await AsyncStorage.removeItem("user_PIN");
    router.replace("/login");
  };

  const openMenu = () => {
    setMenuOpen(true);
    Animated.timing(slideAnim, {
      toValue: width - 260,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: width,
      duration: 250,
      useNativeDriver: false,
    }).start(() => setMenuOpen(false));
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
          <TouchableOpacity onPress={openMenu}>
            <Image source={profileImage} style={styles.profile} resizeMode="contain" />
          </TouchableOpacity>
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

      {/* APPLY LOAN BUTTON */}
      <View style={styles.applyLoanContainer}>
        <TouchableOpacity
          style={styles.applyLoanButton}
          onPress={() => router.push("/dashboard/loan_apply")}
        >
          <Text style={styles.applyLoanText}>
            Apply for Loan
          </Text>
        </TouchableOpacity>
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

      {menuOpen && (
      <>
        {/* Overlay */}
        <Pressable style={styles.overlay} onPress={closeMenu} />
          
        {/* Side Panel */}
        <Animated.View style={[styles.sideMenu, { left: slideAnim }]}>
          <Image source={profileImage} style={styles.menuAvatar} />
          <Text style={styles.menuName}>{userName}</Text>
          
          <View style={styles.menuDivider} />
          
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.menuItem}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      </>
    )}
    </SafeAreaView>
  );
}
