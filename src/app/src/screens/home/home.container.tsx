import { FC, useCallback, useEffect, useRef, useState } from "react";
import { ToastAndroid } from "react-native";

import { IHttpConfig, request } from "~/configs/api";
import { useUserStore } from "~/configs/state/user-store";
import { HomeView } from "./home";
import { TEvent, THomeContainerProps } from "./types";

type TFeedError = { message: string };

const VIACEP_BASE_URL = "https://viacep.com.br/ws";

export const HomeContainer: FC<THomeContainerProps> = () => {
  const [events, setEvents] = useState<TEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [likedEventIds, setLikedEventIds] = useState<Set<string>>(new Set());
  const [location, setLocation] = useState("Selecionar cidade");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const { userToken } = useUserStore();
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchFeed = useCallback(async () => {
    setIsLoading(true);
    const config: IHttpConfig = { path: "/events", method: "GET" };
    await request<TEvent[], TFeedError>(config, {
      onSuccess: (data) => {
        setEvents(data);
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

  const loadEvents = useCallback(
    (name: string, category: string) => {
      const needsSearch = name.trim() !== "" || category !== "Todos";
      if (needsSearch) {
        fetchSearch(name.trim(), category);
      } else {
        fetchFeed();
      }
    },
    [fetchFeed, fetchSearch],
  );

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      loadEvents(query, selectedCategory);
    }, 700);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    loadEvents(searchQuery, category);
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
      events={events}
      isLoading={isLoading}
      isSearching={isSearching}
      searchQuery={searchQuery}
      selectedCategory={selectedCategory}
      likedEventIds={likedEventIds}
      location={location}
      isLocationModalOpen={isLocationModalOpen}
      onSearchChange={handleSearchChange}
      onCategoryChange={handleCategoryChange}
      onToggleLike={handleToggleLike}
      onOpenLocationModal={() => setIsLocationModalOpen(true)}
      onCloseLocationModal={() => setIsLocationModalOpen(false)}
      onConfirmLocation={handleConfirmLocation}
    />
  );
};
