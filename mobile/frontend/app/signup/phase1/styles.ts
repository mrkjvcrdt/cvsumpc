import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#006400",
    marginBottom: 15,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    color: "#333",
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fafafa",
  },
  birthdayContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  birthdayInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fafafa",
  },
  birthdayInputYear: { marginRight: 4 },
  birthdayInputMonth: { marginHorizontal: 4 },
  birthdayInputDay: { marginLeft: 4 },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  nextButton: {
    backgroundColor: "#006400",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  nextButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
