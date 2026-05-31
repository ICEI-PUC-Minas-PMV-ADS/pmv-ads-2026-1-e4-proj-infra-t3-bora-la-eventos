import { FC, useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { TComment, TEventDetailContainerProps } from "./types";
import { EventDetailView } from "./event-detail";
import { ToastAndroid } from "react-native";
import { IHttpConfig, request } from "~/configs/api";
import { IUser, useUserStore } from "~/configs/state/user-store";

type TFeedError = { message: string };

export const EventDetailContainer: FC<TEventDetailContainerProps> = ({
  route,
  navigation,
}) => {
  const { event } = route.params;
  const [isLiked, setIsLiked] = useState(false);
  const { userToken, currentUser } = useUserStore();

   const [comments, setComments] = useState<TComment[]>([])

    const sendComment = async (text: string) => {
      const config: IHttpConfig = {
        path: `/comments`,
        method: "POST",
        headers: { Authorization: userToken, "Content-Type": "application/json", },
        body: JSON.stringify({
          "EventId": event.id,
          "UserId": (currentUser as IUser).id,
          "Text": text
        }),
      };
  
      await request<{ message: string }, TFeedError>(config, {
        onSuccess: () => {
          fetchComments()
        },
        onError: () => {
          ToastAndroid.show("Erro ao registrar interesse.", ToastAndroid.SHORT);
        },
      });
  }

  const fetchComments = useCallback(async () => {
    const config: IHttpConfig = {
      path: `/comments/${event.id}`,
      method: "GET",
      headers: { Authorization: userToken },
    };

    await request<TComment[], TFeedError>(config, {
      onSuccess: (data) => {
        setComments(data);
      },
      onError: () => {
        ToastAndroid.show("Erro ao carregar comentários.", ToastAndroid.SHORT);
      },
    });
  }, [event.id, userToken]);

  useFocusEffect(
    useCallback(() => {
      fetchComments();
    }, [fetchComments])
  );

  return (
    <EventDetailView
      event={event}
      isLiked={isLiked}
      comments={comments}
      sendComment={sendComment}
      onToggleLike={() => setIsLiked((prev) => !prev)}
      onBack={() => navigation.goBack()}
    />
  );
};
