import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#006400", // dark green
    paddingTop: Platform.OS === "android" ? 20 : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 5, // reduced
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 50,
    tintColor: "yellow", // changes the logo color to yellow
  },
  logoLabel: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  profile: {
    width: 50,
    height: 50,
    borderRadius: 25, // no border now
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  accountText: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 40,
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "#FF5252",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10, // spacing between calculator and profile
  },
  
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25, // makes it circular
    backgroundColor: "rgba(255,255,255,0.2)", // white with 20% opacity
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  
  iconImage: {
    width: 28,
    height: 28,
  },  
  // ===== WIDGET CARD =====
  widgetCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginTop: 15,
    padding: 20,
    borderRadius: 16,
    elevation: 4,
  },
  widgetTitle: {
    fontSize: 20,
    color: "#000",
    fontWeight: 600,
  },
  widgetAmount: {
    fontSize: 32,
    fontWeight: 900,
    color: "#000",
    marginVertical: 8,
    alignSelf: "flex-end",
  },
  widgetSubText: {
    fontSize: 14,
    color: "#000",
    fontWeight: 400,
  },
  widgetContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  widgetFrame: {
    height: 140,
    backgroundColor: "#ffbf00",
    borderRadius: 16,
    padding: 20,
    paddingTop: 15,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  /* ===== DOTS ===== */
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },

  activeDot: {
    backgroundColor: "#ffbf00",
  },

  // OVERLAY MENU
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  sideMenu: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 260,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
    elevation: 10,
  },
  menuAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: "center",
    marginBottom: 12,
  },
  menuName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#006400",
    textAlign: "center",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 20,
  },
  menuItem: {
    fontSize: 16,
    color: "#006400",
    paddingVertical: 10,
    fontWeight: "600",
  },

  // APPLY LOAN BUTTON
  applyLoanContainer: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  applyLoanButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
  },
  applyLoanText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#006400",
  },
});

