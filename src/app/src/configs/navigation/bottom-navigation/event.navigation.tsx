import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { EventContainer } from "~/screens/event/";

const { Navigator, Screen } = createNativeStackNavigator();

export const EventNavigationStack = () => {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen name="EventScreen" component={EventContainer} />
    </Navigator>
  );
};
