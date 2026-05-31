import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { LoginContainer } from "~/screens/auth/login/";
import { SignInContainer } from "~/screens/auth/sign-in/";

import { EventNavigationStack } from "./bottom-navigation/event.navigation";
import { HomeNavigationStack } from "./bottom-navigation/home.navigation";
import { UserNavigationStack } from "./bottom-navigation/user.navigation";
import { IconType, renderIcon, renderLabel } from "./tab-icons";

import { theme } from "../theme";
import { scale } from "~/util/scale";

export type TUnauthRouteParams = {
  LoginScreen: undefined;
  SignInScreen: undefined;
};

const UnauthStack = createNativeStackNavigator<TUnauthRouteParams>();
const AuthStack = createBottomTabNavigator();

export const UnauthenticatedStack = () => {
  return (
    <UnauthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <UnauthStack.Screen name="LoginScreen" component={LoginContainer} />
      <UnauthStack.Screen name="SignInScreen" component={SignInContainer} />
    </UnauthStack.Navigator>
  );
};

export const AuthenticatedStack = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        tabBarStyle: {
          paddingBottom: scale(10),
          borderTopWidth: 1,
          borderTopColor: theme.colors.primary,
        },
      }}
    >
      <AuthStack.Screen
        name="Explorar"
        component={HomeNavigationStack}
        options={{
          tabBarActiveBackgroundColor: theme.colors.primaryTransparent,
          tabBarIcon: (props) => renderIcon(IconType.HOME, props.focused),
          tabBarLabel: (props) => renderLabel(props),
        }}
      />
      <AuthStack.Screen
        name="Meus Eventos"
        component={EventNavigationStack}
        options={{
          tabBarActiveBackgroundColor: theme.colors.primaryTransparent,
          tabBarIcon: (props) => renderIcon(IconType.EVENT, props.focused),
          tabBarLabel: (props) => renderLabel(props),
        }}
      />
      <AuthStack.Screen
        name="Perfil"
        component={UserNavigationStack}
        options={{
          tabBarActiveBackgroundColor: theme.colors.primaryTransparent,
          tabBarIcon: (props) => renderIcon(IconType.USER, props.focused),
          tabBarLabel: (props) => renderLabel(props),
        }}
      />
    </AuthStack.Navigator>
  );
};
