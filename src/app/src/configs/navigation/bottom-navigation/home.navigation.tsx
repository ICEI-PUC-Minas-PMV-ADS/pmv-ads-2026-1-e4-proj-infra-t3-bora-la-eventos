import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ExploreContainer } from "~/screens/explore";
import { HomeContainer } from "~/screens/home/home.container";
import { EventDetailContainer } from "~/screens/event-detail";
import { TEvent } from "~/screens/home/types";

export type THomeRouteParams = {
  ExploreScreen: undefined;
  HomeScreen: undefined;
  EventDetailScreen: { event: TEvent };
};

const { Navigator, Screen } = createNativeStackNavigator<THomeRouteParams>();

export const HomeNavigationStack = () => {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="ExploreScreen" component={ExploreContainer} />
      <Screen name="HomeScreen" component={HomeContainer} />
      <Screen name="EventDetailScreen" component={EventDetailContainer} />
    </Navigator>
  );
};
