import { StyleSheet } from "react-native";
import { horizontalScale, scale, verticalScale } from "~/util/scale";

export const InputStyles = StyleSheet.create({
  label: {
    color: "#334155",
    fontSize: scale(14),
    fontWeight: 500,
  },
  input: {
    borderWidth: 1,
    width: "100%",
    borderColor: "#CBD5E1",
    borderRadius: 10,
    color: "#334155",
    paddingHorizontal: horizontalScale(17),
    paddingVertical: verticalScale(18),
  },
  pressable: {
    position: "absolute",
    right: horizontalScale(16),
    top: 18,
    zIndex: 2,
  },
  container: {
    gap: verticalScale(8),
  },
});
