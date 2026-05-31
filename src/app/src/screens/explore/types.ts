import { TEvent } from "~/screens/home/types";

export type TEventWithDistance = TEvent & { distanceKm: number | null };

export type TExploreViewProps = {
  events: TEventWithDistance[];
  selectedCategory: string;
  isLoading: boolean;
  locationError: boolean;
  likedEventIds: Set<string>;
  userLat?: number;
  userLng?: number;
  onCategoryChange: (category: string) => void;
  onToggleLike: (id: string) => void;
  onViewDetail: (id: string) => void;
  onViewAll: () => void;
  onEventPinPress: (id: string) => void;
  onRetryLocation: () => void;
};

export type TExploreContainerProps = {};
