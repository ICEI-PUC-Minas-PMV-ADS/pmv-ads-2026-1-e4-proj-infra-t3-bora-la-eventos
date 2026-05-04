import { StyleSheet } from "react-native";

export const ORANGE = "#f97316";

export const styles = StyleSheet.create({
  container: {
    width: 220,
    backgroundColor: "#ffffff",
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    gap: 10,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#fff7ed",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 1,
  },
  menu: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 2,
    gap: 10,
  },
  menuItemActive: {
    backgroundColor: "#fff7ed",
  },
  menuItemText: {
    fontSize: 14,
    color: "#374151",
  },
  menuItemTextActive: {
    color: ORANGE,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#9ca3af",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    flex: 1,
  },
  footerName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  footerRole: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 1,
  },
});
