import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { LoginContainer } from "~/screens/auth/login/";
import { SignInContainer } from "~/screens/auth/sign-in/";
import { HomeContainer } from "~/screens/home/home.container";

const UnauthStack = createNativeStackNavigator();
const AuthStack = createBottomTabNavigator();

export const UnauthenticatedStack = () => {
  return (
    <UnauthStack.Navigator>
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
      <AuthStack.Screen name="Home" component={HomeContainer} />
    </AuthStack.Navigator>
  );
};
