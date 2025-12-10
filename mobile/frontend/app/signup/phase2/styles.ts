import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40, // extra space for keyboard scrolling
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#006400",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    color: "#333",
    marginBottom: 4,
    fontWeight: "500",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fafafa",
  },
  errorText: {
    color: "red",
    marginTop: 4,
    fontSize: 12,
  },
  nextButton: {
    backgroundColor: "#006400",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  nextButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.3)",
},
modalContent: {
  position: "absolute",
  top: "40%",
  left: "10%",
  right: "10%",
  backgroundColor: "white",
  borderRadius: 8,
  paddingVertical: 10,
},
modalOption: {
  paddingVertical: 12,
  paddingHorizontal: 20,
},
modalOptionText: {
  fontSize: 16,
  color: "#333",
},

});

