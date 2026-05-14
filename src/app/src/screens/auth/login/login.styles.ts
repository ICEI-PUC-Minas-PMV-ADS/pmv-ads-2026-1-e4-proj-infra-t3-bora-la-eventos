import { StyleSheet } from "react-native";
import { horizontalScale, scale, verticalScale } from "~/utils/scale";

export const LoginViewStyles = StyleSheet.create({
  // Views
  screen: {
    alignItems: "center",
    flex: 1,
    gap: verticalScale(32),
    paddingHorizontal: horizontalScale(16),
    backgroundColor: "#F8F6F6",
  },
  iconContainer: {
    alignItems: "center",
    backgroundColor: "#EC5B131A",
    borderRadius: 40,
    height: verticalScale(80),
    justifyContent: "center",
    width: horizontalScale(80),
  },
  logoWrapper: {
    alignItems: "center",
    gap: verticalScale(24),
  },
  titleWrapper: {
    gap: verticalScale(8),
  },
  form: {
    gap: verticalScale(16),
    width: "100%",
  },
  // Fonts
  title: {
    color: "#0F172A",
    fontSize: scale(32),
    fontWeight: 900,
    textAlign: "center",
  },
  description: {
    color: "#475569",
    fontSize: scale(16),
    fontWeight: 400,
    textAlign: "center",
  },
});
