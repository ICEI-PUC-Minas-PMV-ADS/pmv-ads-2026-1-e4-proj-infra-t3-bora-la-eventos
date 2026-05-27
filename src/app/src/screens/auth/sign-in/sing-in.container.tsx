import { FC } from "react";

import { SignInView } from "./sign-in";
import { TSignInContainerProps } from "./types";

export const SignInContainer: FC<TSignInContainerProps> = () => {
  return <SignInView />;
};
