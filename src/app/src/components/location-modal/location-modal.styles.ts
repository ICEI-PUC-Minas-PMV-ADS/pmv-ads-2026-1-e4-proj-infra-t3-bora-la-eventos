import { StyleSheet } from "react-native";
import { scale } from "~/util/scale";

export const LocationModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: scale(18),
    fontWeight: "700",
    color: "#0F172A",
  },
  description: {
    fontSize: scale(14),
    color: "#64748B",
    lineHeight: scale(20),
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: scale(16),
    color: "#334155",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
});
