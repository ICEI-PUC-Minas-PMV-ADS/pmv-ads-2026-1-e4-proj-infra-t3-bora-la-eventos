import { StyleSheet } from "react-native";
import { scale, horizontalScale, verticalScale } from "~/util/scale";

export const HomeViewStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8F6F6",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: horizontalScale(16),
    paddingBottom: verticalScale(8),
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  locationText: {
    fontSize: scale(18),
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.45,
  },
  bellButton: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(226,232,240,0.5)",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(12),
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(226,232,240,0.5)",
    borderWidth: 1,
    borderColor: "rgba(203,213,225,0.3)",
    borderRadius: 12,
    paddingLeft: 16,
    height: 48,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: scale(16),
    color: "#334155",
    height: "100%",
  },
  chipsScroll: {
    height: 56,
  },
  chipsContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: horizontalScale(16),
    gap: 8,
    paddingVertical: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    height: 40,
    borderRadius: 9999,
    backgroundColor: "rgba(226,232,240,0.5)",
    borderWidth: 1,
    borderColor: "rgba(203,213,225,0.3)",
  },
  chipSelected: {
    backgroundColor: "#EC5B13",
    borderColor: "#EC5B13",
    shadowColor: "rgba(236,91,19,0.2)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  chipText: {
    fontSize: scale(14),
    fontWeight: "500",
    color: "#334155",
  },
  chipTextSelected: {
    fontWeight: "600",
    color: "#FFFFFF",
  },
  sectionContainer: {
    paddingHorizontal: horizontalScale(16),
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(8),
    gap: 4,
  },
  sectionTitle: {
    fontSize: scale(20),
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  sectionDescription: {
    fontSize: scale(14),
    color: "#64748B",
    lineHeight: scale(20),
  },
  cardWrapper: {
    paddingHorizontal: horizontalScale(16),
  },
  separator: {
    height: 24,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: verticalScale(48),
    paddingHorizontal: horizontalScale(16),
  },
  emptyText: {
    fontSize: scale(16),
    color: "#64748B",
    textAlign: "center",
  },
});
