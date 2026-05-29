import { FC, useState } from "react";

import { TEventDetailContainerProps } from "./types";
import { EventDetailView } from "./event-detail";

export const EventDetailContainer: FC<TEventDetailContainerProps> = ({
  route,
  navigation,
}) => {
  const { event } = route.params;
  const [isLiked, setIsLiked] = useState(false);

  return (
    <EventDetailView
      event={event}
      isLiked={isLiked}
      onToggleLike={() => setIsLiked((prev) => !prev)}
      onBack={() => navigation.goBack()}
    />
  );
};
