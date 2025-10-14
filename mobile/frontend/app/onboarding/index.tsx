import React, { useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Welcome to CvSU MPC Mobile",
    description:
      "Easily manage and track your member loans, payments, and savings from anywhere.",
  },
  {
    id: "2",
    title: "Secure with OTP Verification",
    description:
      "Your data and transactions are protected with one-time password verification.",
  },
  {
    id: "3",
    title: "Validated by Admin",
    description:
      "All loan and account requests go through an admin validation process for accuracy and trust.",
  },
  {
    id: "4",
    title: "Start Your Journey",
    description:
      "Join the CvSU MPC community today — stay informed, secure, and in control.",
  },
];

export default function Onboarding() {
  const router = useRouter();
  const ref = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleGetStarted = async () => {
    await AsyncStorage.setItem("onboardingComplete", "true");
    router.replace("./choose"); // navigate to choose screen
  };

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {/* Slides */}
      <Animated.FlatList
        ref={ref}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false, listener: handleScroll }
        )}
        renderItem={({ item }) => (
          <View
            style={{
              width,
              alignItems: "center",
              justifyContent: "center",
              padding: 30,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#006400",
                textAlign: "center",
              }}
            >
              {item.title}
            </Text>
            <Text
              style={{
                marginTop: 10,
                fontSize: 16,
                textAlign: "center",
                color: "#333",
              }}
            >
              {item.description}
            </Text>
          </View>
        )}
      />

      {/* Pagination Dots */}
      <View
        style={{
          flexDirection: "row",
          alignSelf: "center",
          marginBottom: 20,
        }}
      >
        {slides.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: "clamp",
          });
          const dotColor = scrollX.interpolate({
            inputRange,
            outputRange: ["#ccc", "#006400", "#ccc"],
            extrapolate: "clamp",
          });
          return (
            <Animated.View
              key={i.toString()}
              style={{
                height: 8,
                borderRadius: 4,
                marginHorizontal: 5,
                width: dotWidth,
                backgroundColor: dotColor,
              }}
            />
          );
        })}
      </View>

      {/* Get Started Button - visible only on last slide */}
      {currentIndex === slides.length - 1 && (
        <TouchableOpacity
          style={{
            backgroundColor: "#006400",
            margin: 20,
            padding: 15,
            borderRadius: 10,
            alignItems: "center",
          }}
          onPress={handleGetStarted}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Get Started</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
