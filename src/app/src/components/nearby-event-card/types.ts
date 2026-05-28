export type TNearbyEventCardProps = {
  id: string;
  title: string;
  date: string;
  location: string;
  category?: string;
  bannerBase64?: string;
  distanceKm: number | null;
  isLiked: boolean;
  onToggleLike: (id: string) => void;
  onViewDetail: (id: string) => void;
};
