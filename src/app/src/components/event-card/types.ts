export type TEventCardProps = {
  id: string;
  title: string;
  date: string;
  location: string;
  category?: string;
  bannerBase64?: string;
  isLiked: boolean;
  onToggleLike: (id: string) => void;
};
