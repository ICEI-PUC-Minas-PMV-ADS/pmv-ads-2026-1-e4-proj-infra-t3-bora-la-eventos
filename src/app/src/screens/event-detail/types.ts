import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TEvent } from "~/screens/home/types";

type TEventDetailRouteParams = {
  EventDetailScreen: { event: TEvent };
};

export type TEventDetailScreenProps = NativeStackScreenProps<
  TEventDetailRouteParams,
  "EventDetailScreen"
>;

export type TEventDetailContainerProps = TEventDetailScreenProps;

export type TEventDetailViewProps = {
  event: TEvent;
  isLiked: boolean;
  onToggleLike: () => void;
  onBack: () => void;
};
