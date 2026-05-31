import { FC } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Activity,
  Bell,
  Briefcase,
  Cpu,
  Filter,
  MapPin,
  MoreHorizontal,
  Music,
  Palette,
  Search,
  Star,
  Utensils,
} from "lucide-react-native";

import { EventCard } from "~/components/event-card";
import { Loading } from "~/components/loading";
import { LocationModal } from "~/components/location-modal";
import { scale } from "~/util/scale";
import { HomeViewStyles } from "./home.styles";
import { THomeViewProps } from "./types";

const CATEGORIES = [
  "Todos",
  "Musica",
  "Esporte",
  "Arte",
  "Gastronomia",
  "Tecnologia",
  "Negocios",
  "Festas",
  "Outro",
];

const CATEGORY_LABELS: Record<string, string> = {
  Todos: "Todos",
  Musica: "Música",
  Esporte: "Esporte",
  Arte: "Arte",
  Gastronomia: "Gastronomia",
  Tecnologia: "Tecnologia",
  Negocios: "Negócios",
  Festas: "Festas",
  Outro: "Outro",
};

const renderChipIcon = (category: string, isSelected: boolean) => {
  const color = isSelected ? "#FFFFFF" : "#475569";
  const size = scale(12);
  switch (category) {
    case "Todos":
      return <Filter size={size} color={color} />;
    case "Musica":
      return <Music size={size} color={color} />;
    case "Esporte":
      return <Activity size={size} color={color} />;
    case "Arte":
      return <Palette size={size} color={color} />;
    case "Gastronomia":
      return <Utensils size={size} color={color} />;
    case "Tecnologia":
      return <Cpu size={size} color={color} />;
    case "Negocios":
      return <Briefcase size={size} color={color} />;
    case "Festas":
      return <Star size={size} color={color} />;
    default:
      return <MoreHorizontal size={size} color={color} />;
  }
};

export const HomeView: FC<THomeViewProps> = ({
  events,
  isLoading,
  isSearching,
  hasMore,
  searchQuery,
  selectedCategory,
  likedEventIds,
  location,
  isLocationModalOpen,
  onSearchChange,
  onSubmitSearch,
  onCategoryChange,
  onLoadMore,
  onToggleLike,
  onViewDetail,
  onOpenLocationModal,
  onCloseLocationModal,
  onConfirmLocation,
}) => {
  const insets = useSafeAreaInsets();
  const {
    screen,
    header,
    locationButton,
    locationText,
    bellButton,
    searchContainer,
    searchBar,
    searchInput,
    searchButton,
    chipsScroll,
    chipsContent,
    chip,
    chipSelected,
    chipText,
    chipTextSelected,
    sectionContainer,
    sectionTitle,
    sectionDescription,
    cardWrapper,
    separator,
    emptyContainer,
    emptyText,
    listFooter,
  } = HomeViewStyles;

  const renderListHeader = () => (
    <>
      <View style={[header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={locationButton} onPress={onOpenLocationModal}>
          <MapPin size={scale(16)} color="#EC5B13" />
          <Text style={locationText}>{location}</Text>
        </TouchableOpacity>
        <View style={bellButton}>
          <Bell size={scale(16)} color="#334155" />
        </View>
      </View>

      <View style={searchContainer}>
        <View style={searchBar}>
          <Search size={scale(18)} color="#64748B" />
          <TextInput
            style={searchInput}
            placeholder="Buscar eventos, artistas ou locais"
            placeholderTextColor="#64748B"
            value={searchQuery}
            onChangeText={onSearchChange}
            returnKeyType="search"
            onSubmitEditing={onSubmitSearch}
          />
          {isSearching ? (
            <ActivityIndicator size="small" color="#EC5B13" style={searchButton} />
          ) : (
            <TouchableOpacity style={searchButton} onPress={onSubmitSearch}>
              <Search size={scale(18)} color="#EC5B13" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={chipsScroll}
        contentContainerStyle={chipsContent}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[chip, isSelected && chipSelected]}
              onPress={() => onCategoryChange(cat)}
            >
              {renderChipIcon(cat, isSelected)}
              <Text style={[chipText, isSelected && chipTextSelected]}>
                {CATEGORY_LABELS[cat]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={sectionContainer}>
        <Text style={sectionTitle}>Próximos a você</Text>
        <Text style={sectionDescription}>
          Eventos acontecendo em {location} hoje e nos próximos dias
        </Text>
      </View>
    </>
  );

  const renderEmpty = () => (
    <View style={emptyContainer}>
      <Text style={emptyText}>Nenhum evento encontrado.</Text>
    </View>
  );

  return (
    <>
      <Loading show={isLoading} />
      <FlatList
        style={screen}
        data={events}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderListHeader()}
        ListEmptyComponent={!isLoading ? renderEmpty : null}
        ListFooterComponent={hasMore ? <ActivityIndicator color="#EC5B13" style={listFooter} /> : null}
        contentContainerStyle={{ paddingBottom: 32 }}
        renderItem={({ item }) => (
          <View style={cardWrapper}>
            <EventCard
              id={item.id}
              title={item.title}
              date={item.date}
              location={item.location}
              category={item.category}
              bannerBase64={item.bannerBase64}
              isLiked={likedEventIds.has(item.id)}
              onToggleLike={onToggleLike}
              onViewDetail={onViewDetail}
            />
          </View>
        )}
        ItemSeparatorComponent={() => <View style={separator} />}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        keyboardShouldPersistTaps="handled"
      />
      <LocationModal
        visible={isLocationModalOpen}
        onConfirm={onConfirmLocation}
        onClose={onCloseLocationModal}
      />
    </>
  );
};
