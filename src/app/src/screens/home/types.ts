export type TAddress = {
  street: string;
  number: string;
  city: string;
  state: string;
  zipCode: string;
};

export type TEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  address: TAddress;
  location: string;
  category?: string;
  bannerBase64?: string;
  capacity: number;
  participantsCount: number;
  status: string;
};

export type THomeContainerProps = {};

export type THomeViewProps = {
  events: TEvent[];
  isLoading: boolean;
  isSearching: boolean;
  hasMore: boolean;
  searchQuery: string;
  selectedCategory: string;
  likedEventIds: Set<string>;
  location: string;
  isLocationModalOpen: boolean;
  onSearchChange: (query: string) => void;
  onSubmitSearch: () => void;
  onCategoryChange: (category: string) => void;
  onLoadMore: () => void;
  onToggleLike: (eventId: string) => void;
  onOpenLocationModal: () => void;
  onCloseLocationModal: () => void;
  onConfirmLocation: (cep: string) => void;
};
