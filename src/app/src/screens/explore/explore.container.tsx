import { FC, useCallback, useEffect, useState } from "react";
import { ToastAndroid } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Location from "expo-location";

import { IHttpConfig, request } from "~/configs/api";
import { useUserStore } from "~/configs/state/user-store";
import type { THomeRouteParams } from "~/configs/navigation/bottom-navigation/home.navigation";
import { TEvent } from "~/screens/home/types";
import { ExploreView } from "./explore";
import { TEventWithDistance, TExploreContainerProps } from "./types";

type TFeedError = { message: string };

const RADIUS_KM = 25;
const LOCATION_TIMEOUT_MS = 12000;

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function getLocation(): Promise<Location.LocationObject> {
  return new Promise<Location.LocationObject>((resolve, reject) => {
    let sub: Location.LocationSubscription | null = null;

    const timer = setTimeout(async () => {
      sub?.remove();
      const last = await Location.getLastKnownPositionAsync();
      if (last) resolve(last);
      else reject(new Error("no_location"));
    }, LOCATION_TIMEOUT_MS);

    Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 0 },
      (pos) => {
        clearTimeout(timer);
        sub?.remove();
        resolve(pos);
      },
    ).then((s) => {
      sub = s;
    });
  });
}

export const ExploreContainer: FC<TExploreContainerProps> = () => {
  const navigation = useNavigation<NativeStackNavigationProp<THomeRouteParams>>();
  const { userToken } = useUserStore();

  const [allEvents, setAllEvents] = useState<TEventWithDistance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locationError, setLocationError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [likedEventIds, setLikedEventIds] = useState<Set<string>>(new Set());
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>(
    undefined,
  );
  const [locationKey, setLocationKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setLocationError(false);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        if (!cancelled) {
          setLocationError(true);
          setIsLoading(false);
        }
        return;
      }

      let lat: number;
      let lng: number;
      try {
        const pos = await getLocation();
        if (cancelled) return;
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      } catch {
        if (!cancelled) {
          setLocationError(true);
          setIsLoading(false);
        }
        return;
      }

      setUserLocation({ lat, lng });

      const config: IHttpConfig = {
        path: `/events/nearby?latitude=${lat}&longitude=${lng}&radiusKm=${RADIUS_KM}`,
        method: "GET",
      };

      await request<TEvent[], TFeedError>(config, {
        onSuccess: (data) => {
          if (cancelled) return;
          const list = Array.isArray(data) ? data : [];
          const withDistance: TEventWithDistance[] = list.map((e) => ({
            ...e,
            distanceKm: e.geoLocation
              ? haversineKm(
                  lat,
                  lng,
                  e.geoLocation.coordinates[1],
                  e.geoLocation.coordinates[0],
                )
              : null,
          }));
          withDistance.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
          setAllEvents(withDistance);
          setIsLoading(false);
        },
        onError: () => {
          if (cancelled) return;
          setIsLoading(false);
          ToastAndroid.show("Erro ao buscar eventos próximos.", ToastAndroid.SHORT);
        },
      });
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationKey]);

  const handleRetryLocation = useCallback(() => {
    setUserLocation(undefined);
    setAllEvents([]);
    setLocationKey((prev) => prev + 1);
  }, []);

  const filteredEvents =
    selectedCategory === "Todos"
      ? allEvents
      : allEvents.filter((e) => e.category === selectedCategory);

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

  const handleViewDetail = (eventId: string) => {
    const event = allEvents.find((e) => e.id === eventId);
    if (event) navigation.navigate("EventDetailScreen", { event });
  };

  return (
    <ExploreView
      events={filteredEvents}
      selectedCategory={selectedCategory}
      isLoading={isLoading}
      locationError={locationError}
      likedEventIds={likedEventIds}
      userLat={userLocation?.lat}
      userLng={userLocation?.lng}
      onCategoryChange={setSelectedCategory}
      onToggleLike={handleToggleLike}
      onViewDetail={handleViewDetail}
      onViewAll={() => navigation.navigate("HomeScreen")}
      onEventPinPress={handleViewDetail}
      onRetryLocation={handleRetryLocation}
    />
  );
};
