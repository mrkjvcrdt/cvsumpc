import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Use flexGrow for ScrollView contentContainerStyle
    backgroundColor: "white",
    padding: 20,
    justifyContent: "center", // vertically center the content
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#006400",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: "#333",
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "500",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc", // visible outline
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fafafa",
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  passwordToggle: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  passwordIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  errorText: {
    color: "red",
    marginTop: 5,
    fontSize: 12,
  },
  nextButton: {
    backgroundColor: "#006400",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2, // adds shadow on Android
  },
  nextButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
