import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000", // status bar + nav background
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
    color: "#1A1A1A",
  },

  subtitle: {
    fontSize: 15,
    color: "#555",
    marginBottom: 40,
    textAlign: "center",
  },

  pinDotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
  },

  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginHorizontal: 8,
    backgroundColor: "#ccc",
  },

  pinDotFilled: {
    backgroundColor: "#006400",
  },

  keypadContainer: {
    width: "80%",
  },

  keypadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  keyButton: {
    width: 75,
    height: 75,
    borderRadius: 75,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },

  keyText: {
    fontSize: 26,
    fontWeight: "600",
    color: "#333",
  },

  backspaceBtn: {
    width: 75,
    height: 75,
    justifyContent: "center",
    alignItems: "center",
  },

  backspaceText: {
    fontSize: 22,
    color: "#333",
  },

  error: {
    color: "red",
    marginBottom: 20,
    textAlign: "center",
  },
});
