export type TEventPin = {
  id: string;
  title: string;
  lat: number;
  lng: number;
};

export type TExploreMapProps = {
  events: TEventPin[];
  userLat?: number;
  userLng?: number;
  onEventPress?: (eventId: string) => void;
};
