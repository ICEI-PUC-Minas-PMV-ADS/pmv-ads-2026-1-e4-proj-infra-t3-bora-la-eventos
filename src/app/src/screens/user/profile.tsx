import { Text, View } from "react-native";
import { ProfileStyles } from "./profile.styles";

export const ProfileView = () => {
  const { container } = ProfileStyles;
  return (
    <View style={container}>
      <Text>Profile View</Text>
    </View>
  );
};
