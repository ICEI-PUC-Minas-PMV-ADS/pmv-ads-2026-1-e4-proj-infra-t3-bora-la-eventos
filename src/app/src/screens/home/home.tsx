import { FC } from "react";
import { Text, View } from "react-native";

import { THomeViewProps } from "./types";
import { HomeViewStyles } from "./home.styles";

export const HomeView: FC<THomeViewProps> = () => {
  const { container } = HomeViewStyles;

  return (
    <View style={container}>
      <Text>Home Screen</Text>
    </View>
  );
};
