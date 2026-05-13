import { FC } from "react";

import { TProfileContainerProps } from "./types";
import { ProfileView } from "./profile";

export const ProfileContainer: FC<TProfileContainerProps> = () => {
  return <ProfileView />;
};
