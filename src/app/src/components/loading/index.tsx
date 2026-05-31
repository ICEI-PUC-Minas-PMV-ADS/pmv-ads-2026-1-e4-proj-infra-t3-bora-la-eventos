import { theme } from "~/configs/theme";
import { ActivityIndicator, useWindowDimensions } from "react-native";
import { FC } from "react";

export type TLoadingProps = {
  show: boolean;
};

export const Loading: FC<TLoadingProps> = ({ show }) => {
  const { width, height } = useWindowDimensions();
  if (show) {
    return (
      <ActivityIndicator
        size={60}
        color={theme.colors.textSecondary}
        animating
        style={{
          height,
          width,
          position: "absolute",
          zIndex: 2,
          backgroundColor: theme.colors.textPrimaryTransparent,
        }}
      />
    );
  }
  return null
};
