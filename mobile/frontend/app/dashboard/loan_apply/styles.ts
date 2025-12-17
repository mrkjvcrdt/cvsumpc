import { StyleSheet, Platform, StatusBar } from "react-native";

export const styles = StyleSheet.create({
  /* SAFE AREA */
  safeArea: {
    flex: 1,
    backgroundColor: "#006400",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  /* HEADER (same as loan calculator) */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },

  backButton: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  backIcon: {
    width: 24,
    height: 24,
    tintColor: "#fff",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  /* CONTENT */
  container: {
    flex: 1,
    backgroundColor: "#006400",
  },

  formContainer: {
    padding: 20,
  },

  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },

  textInput: {
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
  },

  /* PAYSLIP UPLOAD */
  uploadBox: {
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 14,
    marginBottom: 20,
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#ccc",
  },

  uploadText: {
    color: "#555",
    fontSize: 14,
  },

  /* SUBMIT BUTTON */
  submitButton: {
    backgroundColor: "#FFD700",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  submitText: {
    color: "#006400",
    fontWeight: "bold",
    fontSize: 16,
  },
  pickerWrapper: {
    backgroundColor: "#fff",
    borderRadius: 6,
    marginBottom: 16,
  },

});
