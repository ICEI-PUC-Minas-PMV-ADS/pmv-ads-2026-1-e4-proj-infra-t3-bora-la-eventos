import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ToastAndroid } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { IHttpConfig, request } from "~/configs/api";
import { useUserStore } from "~/configs/state/user-store";
import { THomeRouteParams } from "~/configs/navigation/bottom-navigation/home.navigation";
import { HomeView } from "./home";
import { TEvent, THomeContainerProps } from "./types";

type TFeedError = { message: string };

const VIACEP_BASE_URL = "https://viacep.com.br/ws";
const PAGE_SIZE = 10;

export const HomeContainer: FC<THomeContainerProps> = () => {
  const navigation = useNavigation<NativeStackNavigationProp<THomeRouteParams>>();
  const [events, setEvents] = useState<TEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(PAGE_SIZE);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [likedEventIds, setLikedEventIds] = useState<Set<string>>(new Set());
  const [location, setLocation] = useState("Selecionar cidade");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const { userToken } = useUserStore();
  const isInitialMount = useRef(true);

  const displayedEvents = useMemo(
    () => events.slice(0, displayedCount),
    [events, displayedCount],
  );
  const hasMore = displayedCount < events.length;

  const fetchFeed = useCallback(async () => {
    setIsLoading(true);
    const config: IHttpConfig = { path: "/events", method: "GET" };
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

  const fetchSearch = useCallback(async (name: string, category: string) => {
    setIsSearching(true);
    const params = new URLSearchParams();
    if (name) params.append("name", name);
    if (category && category !== "Todos") params.append("category", category);

    const config: IHttpConfig = {
      path: `/events/search?${params.toString()}`,
      method: "GET",
    };
    await request<TEvent[], TFeedError>(config, {
      onSuccess: (data) => {
        setEvents(Array.isArray(data) ? data : []);
        setIsSearching(false);
      },
      onError: () => {
        setIsSearching(false);
        ToastAndroid.show("Erro ao buscar eventos.", ToastAndroid.SHORT);
      },
    });
  }, []);

  useEffect(() => {
    setDisplayedCount(PAGE_SIZE);
  }, [events]);


  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (searchQuery.trim() !== "" || selectedCategory !== "Todos") {
      fetchSearch(searchQuery.trim(), selectedCategory);
    } else {
      fetchFeed();
    }
  }, [selectedCategory]);

  const handleSubmitSearch = () => {
    if (searchQuery.trim() !== "" || selectedCategory !== "Todos") {
      fetchSearch(searchQuery.trim(), selectedCategory);
    } else {
      fetchFeed();
    }
  };

  const handleLoadMore = () => {
    if (hasMore) setDisplayedCount((c) => c + PAGE_SIZE);
  };

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
      headers: { Authorization: `Bearer ${userToken}` },
    };

    await request<{ message: string }, TFeedError>(config, {
      onSuccess: () => {},
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

  const handleConfirmLocation = async (cep: string) => {
    setIsLocationModalOpen(false);
    try {
      const response = await fetch(`${VIACEP_BASE_URL}/${cep}/json/`);
      const data = await response.json();
      if (data.erro) {
        ToastAndroid.show("CEP não encontrado.", ToastAndroid.SHORT);
        return;
      }
      setLocation(`${data.localidade}, ${data.uf}`);
    } catch {
      ToastAndroid.show(
        "Erro ao buscar CEP. Tente novamente.",
        ToastAndroid.SHORT,
      );
    }
  };

  return (
    <HomeView
      events={displayedEvents}
      isLoading={isLoading}
      isSearching={isSearching}
      hasMore={hasMore}
      searchQuery={searchQuery}
      selectedCategory={selectedCategory}
      likedEventIds={likedEventIds}
      location={location}
      isLocationModalOpen={isLocationModalOpen}
      onSearchChange={setSearchQuery}
      onSubmitSearch={handleSubmitSearch}
      onCategoryChange={setSelectedCategory}
      onLoadMore={handleLoadMore}
      onToggleLike={handleToggleLike}
      onViewDetail={(eventId) => {
        const event = events.find((e) => e.id === eventId);
        if (event) navigation.navigate("EventDetailScreen", { event });
      }}
      onOpenLocationModal={() => setIsLocationModalOpen(true)}
      onCloseLocationModal={() => setIsLocationModalOpen(false)}
      onConfirmLocation={handleConfirmLocation}
    />
  );
};
