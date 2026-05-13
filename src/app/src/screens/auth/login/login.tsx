import { View, Text } from "react-native";
import { LoginViewStyles } from "./login.styles";
import { FC } from "react";
import { TLoginViewProps } from "./types";

export const LoginView: FC<TLoginViewProps> = () => {
  const { container, label } = LoginViewStyles;

  return (
    <View style={container}>
      <Text style={label}>Login View</Text>
    </View>
  );
};
