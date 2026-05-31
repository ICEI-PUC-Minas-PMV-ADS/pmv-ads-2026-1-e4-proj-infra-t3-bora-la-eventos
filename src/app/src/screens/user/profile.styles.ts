import { StyleSheet } from "react-native";
import { theme } from "~/configs/theme";
import { scale, verticalScale } from "~/util/scale";

export const ProfileStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.backgroundWhite,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: theme.horizontalSpaces.md,
  },
  titleWrapper: {
    alignItems: "center",
    gap: theme.verticalSpaces.sm,
    marginBottom: theme.verticalSpaces.xl,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: theme.colors.primaryTransparent,
    borderRadius: 50,
    height: verticalScale(100),
    justifyContent: "center",
    marginBottom: theme.verticalSpaces.sm,
    width: verticalScale(100),
  },
  avatarText: {
    color: theme.colors.primary,
    fontSize: scale(26),
    fontWeight: "900",
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: scale(30),
    fontWeight: "900",
    textAlign: "center",
  },
  description: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: scale(20),
    textAlign: "center",
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
});
