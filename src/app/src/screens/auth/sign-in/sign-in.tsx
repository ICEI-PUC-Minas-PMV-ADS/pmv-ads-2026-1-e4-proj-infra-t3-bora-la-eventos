import { FC } from "react";
import { Text, View } from "react-native";

import { TSignInViewProps } from "./types";
import { SignInViewStyles } from "./sign-in.styles";

export const SignInView: FC<TSignInViewProps> = () => {
  const {container, label} = SignInViewStyles
  
  return (
    <View style={container}>
      <Text style={label}>Sign In View</Text>
    </View>
  );
};
