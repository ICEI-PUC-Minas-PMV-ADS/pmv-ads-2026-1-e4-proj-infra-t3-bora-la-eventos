import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeContainer } from "~/screens/home/home.container";

const { Navigator, Screen } = createNativeStackNavigator();

export const HomeNavigationStack = () => {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen name="HomeScreen" component={HomeContainer} />
    </Navigator>
  );
};
