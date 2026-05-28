import { Dispatch, SetStateAction } from "react";
import { IUser } from "~/configs/state/user-store";

export type TProfileContainerProps = {};

export type TUpdateProfileData = {
  name: string;
  email: string;
};

export type TUpdateProfileResponseData = IUser | undefined;

export enum ProfileErrorMessage {
  BAD_REQUEST = "BAD_REQUEST",
  CONFLICT = "CONFLICT",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  INVALID_BODY = "INVALID_BODY",
  INVALID_HEADER = "INVALID_HEADER",
  UNAUTHORIZED = "UNAUTHORIZED",
  UNPROCESSABLE_ENTITY = "UNPROCESSABLE_ENTITY",
}

export type TUpdateProfileResponseError = {
  code?: string;
  message?: ProfileErrorMessage | string;
};

export type TProfileViewProps = {
  email: string;
  handleSubmit: () => void;
  handleUpdateEmail: Dispatch<SetStateAction<string>>;
  handleUpdateName: Dispatch<SetStateAction<string>>;
  handleUpdatePassword: Dispatch<SetStateAction<string>>;
  name: string;
  password: string;
};
