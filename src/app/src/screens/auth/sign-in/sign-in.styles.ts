import { StyleSheet } from "react-native";
import { theme } from "~/configs/theme";
import { horizontalScale, scale, verticalScale } from "~/util/scale";

export const SignInViewStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.backgroundWhite,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: theme.horizontalSpaces.md,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: verticalScale(24),
  },
  headerButton: {
    alignItems: "center",
    height: horizontalScale(32),
    justifyContent: "center",
    width: horizontalScale(32),
  },
  headerTitle: {
    color: theme.colors.textPrimary,
    fontSize: scale(16),
    fontWeight: "700",
  },
  titleWrapper: {
    gap: theme.verticalSpaces.sm,
    marginBottom: verticalScale(50),
    marginTop: verticalScale(25),
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: scale(30),
    fontWeight: "900",
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    fontWeight: "400",
    lineHeight: scale(20),
  },
  form: {
    gap: theme.verticalSpaces.md,
    width: "100%",
  },
  button: {
    marginTop: verticalScale(40),
    paddingVertical: verticalScale(14),
    width: "100%",
  },
  callout: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.horizontalSpaces.xs,
    justifyContent: "center",
    marginTop: verticalScale(24),
  },
  calloutText: {
    color: theme.colors.textSecondary,
    fontSize: scale(12),
  },
  calloutAction: {
    color: theme.colors.primary,
    fontSize: scale(12),
    fontWeight: "500",
  },
});
