import { FC } from "react";

import { THomeContainerProps } from "./types";
import { HomeView } from "./home";

export const HomeContainer: FC<THomeContainerProps> = () => {
  return <HomeView />;
};
