import { StyleSheet } from "react-native";
import { scale } from "~/util/scale";

export const NearbyEventCardStyles = StyleSheet.create({
  card: {
    width: 200,
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  banner: {
    width: "100%",
    height: 70,
    backgroundColor: "#E2E8F0",
  },
  content: {
    padding: 8,
    gap: 3,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(236,91,19,0.10)",
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  categoryText: {
    fontSize: scale(10),
    fontWeight: "700",
    color: "#EC5B13",
    textTransform: "uppercase",
  },
  title: {
    fontSize: scale(13),
    fontWeight: "700",
    color: "#0F172A",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoText: {
    fontSize: scale(11),
    color: "#64748B",
    flex: 1,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  distanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  distanceText: {
    fontSize: scale(11),
    color: "#EC5B13",
    fontWeight: "600",
  },
  likeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  likeButtonActive: {
    backgroundColor: "rgba(236,91,19,0.12)",
    borderColor: "#EC5B13",
  },
  likeButtonInactive: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
  },
});
