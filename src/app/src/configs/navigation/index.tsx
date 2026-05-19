import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { LoginContainer } from "~/screens/auth/login/";
import { SignInContainer } from "~/screens/auth/sign-in/";
import { EventNavigationStack } from "./bottom-navigation/event.navigation";
import { HomeNavigationStack } from "./bottom-navigation/home.navigation";
import { UserNavigationStack } from "./bottom-navigation/user.navigation";

export type TUnauthRouteParams = {
  LoginScreen: undefined,
  SignInScreen: undefined,
}

const UnauthStack = createNativeStackNavigator<TUnauthRouteParams>();
const AuthStack = createBottomTabNavigator();

export const UnauthenticatedStack = () => {
  return (
    <UnauthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <UnauthStack.Screen
        name="LoginScreen"
        component={LoginContainer}
      ></UnauthStack.Screen>
      <UnauthStack.Screen
        name="SignInScreen"
        component={SignInContainer}
      ></UnauthStack.Screen>
    </UnauthStack.Navigator>
  );
};

export const AuthenticatedStack = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Explorar" component={HomeNavigationStack} />
      <AuthStack.Screen name="Meus Eventos" component={EventNavigationStack} />
      <AuthStack.Screen name="Perfil" component={UserNavigationStack} />
    </AuthStack.Navigator>
  );
};
