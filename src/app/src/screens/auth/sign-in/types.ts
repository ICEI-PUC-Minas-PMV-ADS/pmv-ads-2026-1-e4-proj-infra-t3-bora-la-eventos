import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TUnauthRouteParams } from "~/configs/navigation";

export type TSignInContainerProps = NativeStackScreenProps<
  TUnauthRouteParams,
  "SignInScreen"
> & {};

export enum SignInErrorMessage {
  BAD_REQUEST = "BAD_REQUEST",
  CONFLICT = "CONFLICT",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  INVALID_BODY = "INVALID_BODY",
  INVALID_HEADER = "INVALID_HEADER",
  UNPROCESSABLE_ENTITY = "UNPROCESSABLE_ENTITY",
}

export type TSignInResponseData = unknown;

export type TSignInResponseError = {
  code?: string;
  message?: SignInErrorMessage | string;
};

export type TSignInData = {
  name: string;
  document: string;
  email: string;
  password: string;
};

export type TSignInViewProps = {
  handleGoBack: () => void;
  handleLogin: () => void;
  handleSubmit: () => void;
  handleUpdateConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
  handleUpdateDocument: React.Dispatch<React.SetStateAction<string>>;
  handleUpdateEmail: React.Dispatch<React.SetStateAction<string>>;
  handleUpdateName: React.Dispatch<React.SetStateAction<string>>;
  handleUpdatePassword: React.Dispatch<React.SetStateAction<string>>;
};
