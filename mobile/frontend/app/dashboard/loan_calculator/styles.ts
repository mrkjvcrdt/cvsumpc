import { StyleSheet, Platform, StatusBar } from "react-native";

const COL_WIDTH = 120;

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#006400",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },

  backIcon: {
    width: 24,
    height: 24,
    tintColor: "#fff",
  },

  backButton: { 
    width: 40, 
    alignItems: "center", 
    justifyContent: "center", 
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  container: {
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

  pickerWrapper: {
    backgroundColor: "#fff",
    borderRadius: 6,
    marginBottom: 16,
  },

  calculateButton: {
    backgroundColor: "#FFD700",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },

  calculateButtonText: {
    color: "#006400",
    fontWeight: "bold",
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#004d00",
    paddingVertical: 10,
  },

  tableHeaderText: {
    width: COL_WIDTH,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },

  tableRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 8,
  },

  tableCell: {
    width: COL_WIDTH,
    textAlign: "center",
    fontSize: 12,
  },

  tableFooter: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#e6ffe6",
    borderRadius: 8,
  },

  footerText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#003300",
  },
});
