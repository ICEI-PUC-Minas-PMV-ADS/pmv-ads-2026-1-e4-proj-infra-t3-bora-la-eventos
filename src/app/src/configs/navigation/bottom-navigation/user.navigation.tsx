import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfileContainer } from "~/screens/user/";

const { Navigator, Screen } = createNativeStackNavigator();

export const UserNavigationStack = () => {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen name="ProfileScreen" component={ProfileContainer} />
    </Navigator>
  );
};
