import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import {
  AuthenticatedStack,
  UnauthenticatedStack,
} from "~/configs/navigation/";
import { useAuthStore } from "./configs/state/auth-state";

const App = () => {
  const {isAuthenticated} = useAuthStore()
  return (
    <NavigationContainer>
      {isAuthenticated ? <AuthenticatedStack /> : <UnauthenticatedStack />}
    </NavigationContainer>
  );
};

export default App;
