import { StyleSheet } from "react-native";

import { theme } from "~/configs/theme";
import { horizontalScale, scale, verticalScale } from "~/util/scale";

export const LoginViewStyles = StyleSheet.create({
  // Views
  screen: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: theme.horizontalSpaces.md,
    backgroundColor: theme.colors.backgroundWhite,
  },
  iconContainer: {
    alignItems: "center",
    backgroundColor: theme.colors.primaryTransparent,
    borderRadius: 40,
    height: theme.verticalSpaces.xxxl,
    justifyContent: "center",
    marginBottom: theme.verticalSpaces.xs,
    marginTop: theme.verticalSpaces.xxl,
    width: theme.horizontalSpaces.xxxl,
  },
  logoWrapper: {
    alignItems: "center",
    gap: theme.verticalSpaces.lg,
    marginBottom: theme.verticalSpaces.xs,
  },
  titleWrapper: {
    gap: theme.verticalSpaces.sm,
  },
  form: {
    gap: theme.verticalSpaces.md,
    width: "100%",
  },
  navigationWrapper: {
    width: "100%",
    paddingTop: theme.verticalSpaces.sm,
    gap: theme.verticalSpaces.xxl,
  },
  calloutWrapper: {
    flexDirection: 'row',
    gap: theme.horizontalSpaces.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Fonts
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.largeTitle,
    fontWeight: 900,
    textAlign: "center",
  },
  description: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    fontWeight: 400,
    textAlign: "center",
  },
  forgotPassword: {
    color: theme.colors.primary,
    fontWeight: 500,
    fontSize: theme.typography.body,
    alignSelf: "flex-end",
  },
  signUpCommon: {
    fontSize: theme.typography.body,
    fontWeight: 400,
    color: theme.colors.textSecondary,
  },
  signUpCallout: {
    fontSize: theme.typography.body,
    fontWeight: 'bold',
    color: theme.colors.primary
  }
});
