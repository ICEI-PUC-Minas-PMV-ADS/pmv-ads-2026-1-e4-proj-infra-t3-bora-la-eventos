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
  comments: TComment[]
  onToggleLike: () => void;
  onBack: () => void;
  sendComment: (text: string) => void
};

export type TComment = {
  id: string
  text: string;
  eventId: string
  userId: string
  createdAt: Date
};