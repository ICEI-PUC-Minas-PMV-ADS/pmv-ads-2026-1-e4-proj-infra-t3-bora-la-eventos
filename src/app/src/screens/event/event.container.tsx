import { FC } from "react";

import { TEventContainerProps } from "./types";
import { EventView } from "./event";

export const EventContainer: FC<TEventContainerProps> = () => {
  return <EventView />;
};
