import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#006400",
    marginBottom: 15,
    textAlign: "center",
  },
  termsContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    maxHeight: 400,
    marginBottom: 20,
    backgroundColor: "#fafafa",
  },
  termsText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  checkboxWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    width: 16,
    height: 16,
    backgroundColor: "#006400",
  },
  nextButton: {
    backgroundColor: "#006400",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  nextButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
