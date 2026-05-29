import { StyleSheet } from "react-native";
import { verticalScale } from "~/util/scale";

export const EventMapStyles = StyleSheet.create({
  container: {
    width: "100%",
    height: verticalScale(180),
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#E2E8F0",
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 13,
    color: "#64748B",
  },
});
