import { IUser } from "~/configs/state/user-store";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TUnauthRouteParams } from "~/configs/navigation";

export type TLoginContainerProps = NativeStackScreenProps<
  TUnauthRouteParams,
  "LoginScreen"
> & {};

export type TLoginResponseData = {
  currentUser: IUser;
  token: string;
};

export enum LoginErrorMessage {
  BAD_REQUEST = "BAD_REQUEST",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  INVALID_BODY = "INVALID_BODY",
  INVALID_HEADER = "INVALID_HEADER",
  NOT_FOUNDED = "NOT_FOUNDED",
  UNAUTHORIZED = "UNAUTHORIZED",
  UNPROCESSABLE_ENTITY = "UNPROCESSABLE_ENTITY",
}

export type TLoginResponseError = { code?: string; message: LoginErrorMessage };

export type TLoginData = {
  email: string;
  password: string;
};

export type TLoginViewProps = {
  handleSubmit: () => void;
  handleForgotPassword: () => void;
  handleSignUp: () => void;
  handleUpdateEmail: React.Dispatch<React.SetStateAction<string>>;
  handleUpdatePassword: React.Dispatch<React.SetStateAction<string>>;
};
