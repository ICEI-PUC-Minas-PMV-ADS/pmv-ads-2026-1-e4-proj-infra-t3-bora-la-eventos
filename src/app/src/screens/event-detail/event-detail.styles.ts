import { StyleSheet } from "react-native";
import { scale, verticalScale } from "~/util/scale";

export const EventDetailStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  banner: {
    width: "100%",
    height: verticalScale(260),
    backgroundColor: "#E2E8F0",
  },
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 9999,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerRight: {
    flexDirection: "row",
    gap: 8,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: scale(22),
    fontWeight: "700",
    color: "#0F172A",
  },
  locationLine: {
    fontSize: scale(14),
    color: "#64748B",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: scale(14),
    color: "#475569",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  sectionTitle: {
    fontSize: scale(16),
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  description: {
    fontSize: scale(14),
    color: "#475569",
    lineHeight: scale(22),
  },
  infoBoxRow: {
    flexDirection: "row",
    gap: 12,
  },
  infoBox: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
  },
  infoBoxLabel: {
    fontSize: scale(10),
    fontWeight: "600",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoBoxRow2: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoBoxValue: {
    fontSize: scale(14),
    fontWeight: "600",
    color: "#0F172A",
  },
  participantsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  participantsText: {
    fontSize: scale(14),
    color: "#475569",
  },
  participantsCount: {
    fontWeight: "700",
    color: "#0F172A",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
});
