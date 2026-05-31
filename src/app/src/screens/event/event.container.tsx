import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { TEventContainerProps } from "./types";
import { EventView } from "./event";
import { TEvent } from "../home/types";
import { useUserStore } from "~/configs/state/user-store";
import { IHttpConfig, request } from "~/configs/api";
import { ToastAndroid } from "react-native";

type TFeedError = { message: string };

const PAGE_SIZE = 10;

export const EventContainer: FC<TEventContainerProps> = () => {

    const [events, setEvents] = useState<TEvent[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [likedEventIds, setLikedEventIds] = useState<Set<string>>(new Set());
    const [displayedCount, setDisplayedCount] = useState(PAGE_SIZE);

    const { userToken } = useUserStore();
    // const isInitialMount = useRef(true);

    // const displayedEvents = useMemo(
    //   () => events.slice(0, displayedCount),
    //   [events, displayedCount],
    // );
    const hasMore = displayedCount < events.length;

    const fetchFeed = useCallback(async () => {
      setIsLoading(true);
      const config: IHttpConfig = { path: "/liked", method: "GET",       headers: { Authorization: userToken }, };
      await request<TEvent[], TFeedError>(config, {
        onSuccess: (data) => {
          setEvents(Array.isArray(data) ? data : []);
          setIsLoading(false);
        },
        onError: () => {
          setIsLoading(false);
          ToastAndroid.show(
            "Erro ao carregar eventos. Tente novamente.",
            ToastAndroid.SHORT,
          );
        },
      });
    }, []);

    const handleToggleLike = async (eventId: string) => {
      const wasLiked = likedEventIds.has(eventId);
  
      setLikedEventIds((prev) => {
        const next = new Set(prev);
        wasLiked ? next.delete(eventId) : next.add(eventId);
        return next;
      });
  
      const config: IHttpConfig = {
        path: `/events/${eventId}/like`,
        method: "POST",
        headers: { Authorization: userToken },
      };
  
      await request<{ message: string }, TFeedError>(config, {
        onSuccess: () => {
          fetchFeed()
        },
        onError: () => {
          setLikedEventIds((prev) => {
            const next = new Set(prev);
            wasLiked ? next.add(eventId) : next.delete(eventId);
            return next;
          });
          ToastAndroid.show("Erro ao registrar interesse.", ToastAndroid.SHORT);
        },
      });
    };

    useFocusEffect(
      useCallback(() => {
        fetchFeed();
      }, [fetchFeed])
    );
  return (
    <EventView events={events} hasMore={hasMore} isLoading={isLoading} onToggleLike={handleToggleLike}/>
  )
};
