import { StyleSheet } from "react-native";
import { horizontalScale, scale, verticalScale } from "~/utils/scale";

export const LoginViewStyles = StyleSheet.create({
  // Views
  screen: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: horizontalScale(16),
    backgroundColor: "#F8F6F6",
  },
  iconContainer: {
    alignItems: "center",
    backgroundColor: "#EC5B131A",
    borderRadius: 40,
    height: verticalScale(80),
    justifyContent: "center",
    marginBottom: verticalScale(32),
    marginTop: verticalScale(48),
    width: horizontalScale(80),
  },
  logoWrapper: {
    alignItems: "center",
    gap: verticalScale(24),
    marginBottom: verticalScale(32),
  },
  titleWrapper: {
    gap: verticalScale(8),
  },
  form: {
    gap: verticalScale(16),
    width: "100%",
  },
  navigationWrapper: {
    width: "100%",
    paddingTop: verticalScale(8),
    gap: verticalScale(45),
  },
  calloutWrapper: {
    flexDirection: 'row',
    gap: horizontalScale(5),
    justifyContent: 'center',
    alignItems: 'center',
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
  forgotPassword: {
    color: "#EC5B13",
    fontWeight: 500,
    fontSize: scale(14),
    alignSelf: "flex-end",
  },
  signUpCommon: {
    fontSize: scale(14),
    fontWeight: 400,
    color: "#475569"
  },
  signUpCallout: {
    fontSize: scale(14),
    fontWeight: 'bold',
    color: "#EC5B13"
  }
});
