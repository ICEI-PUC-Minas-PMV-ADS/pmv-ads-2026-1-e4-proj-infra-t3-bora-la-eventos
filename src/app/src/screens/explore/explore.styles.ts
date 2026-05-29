import { Dimensions, StyleSheet } from "react-native";
import { scale } from "~/util/scale";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
export const MAP_HEIGHT = SCREEN_HEIGHT * 0.48;

export const ExploreStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8F6F6",
  },
  mapContainer: {
    height: MAP_HEIGHT,
    position: "relative",
  },
  searchOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: scale(14),
    color: "#334155",
  },
  chipsScroll: {
    height: 44,
  },
  chipsContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 9999,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  chipSelected: {
    backgroundColor: "#EC5B13",
  },
  chipText: {
    fontSize: scale(13),
    fontWeight: "500",
    color: "#334155",
  },
  chipTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: "#F8F6F6",
    paddingTop: 16,
  },
  bottomSheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  bottomSheetTitle: {
    fontSize: scale(18),
    fontWeight: "700",
    color: "#0F172A",
  },
  viewAllText: {
    fontSize: scale(13),
    fontWeight: "600",
    color: "#EC5B13",
  },
  eventsList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  centerBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 32,
  },
  centerText: {
    fontSize: scale(14),
    color: "#64748B",
    textAlign: "center",
  },
  emptyText: {
    fontSize: scale(14),
    color: "#64748B",
    textAlign: "center",
    padding: 24,
  },
});
