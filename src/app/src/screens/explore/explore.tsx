import { FC } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Activity,
  Briefcase,
  Cpu,
  Filter,
  MapPin,
  Music,
  Palette,
  Star,
  Utensils,
} from "lucide-react-native";

import { ExploreMap } from "~/components/explore-map";
import { NearbyEventCard } from "~/components/nearby-event-card";
import { scale } from "~/util/scale";
import { ExploreStyles } from "./explore.styles";
import { TExploreViewProps } from "./types";

const CATEGORIES = ["Todos","Musica","Esporte","Arte","Gastronomia","Tecnologia","Negocios","Festas","Outro"];
const CATEGORY_LABELS: Record<string, string> = {
  Todos: "Todos", Musica: "Música", Esporte: "Esporte", Arte: "Arte",
  Gastronomia: "Gastronomia", Tecnologia: "Tecnologia", Negocios: "Negócios",
  Festas: "Festas", Outro: "Outro",
};

const renderChipIcon = (category: string, isSelected: boolean) => {
  const color = isSelected ? "#FFFFFF" : "#475569";
  const size = scale(12);
  switch (category) {
    case "Musica": return <Music size={size} color={color} />;
    case "Esporte": return <Activity size={size} color={color} />;
    case "Arte": return <Palette size={size} color={color} />;
    case "Gastronomia": return <Utensils size={size} color={color} />;
    case "Tecnologia": return <Cpu size={size} color={color} />;
    case "Negocios": return <Briefcase size={size} color={color} />;
    case "Festas": return <Star size={size} color={color} />;
    default: return <Filter size={size} color={color} />;
  }
};

export const ExploreView: FC<TExploreViewProps> = ({
  events,
  selectedCategory,
  isLoading,
  locationError,
  likedEventIds,
  userLat,
  userLng,
  onCategoryChange,
  onToggleLike,
  onViewDetail,
  onViewAll,
  onEventPinPress,
  onRetryLocation,
}) => {
  const insets = useSafeAreaInsets();
  const {
    screen,
    mapContainer,
    searchOverlay,
    chipsScroll,
    chipsContent,
    chip,
    chipSelected,
    chipText,
    chipTextSelected,
    bottomSheet,
    bottomSheetHeader,
    bottomSheetTitle,
    viewAllText,
    eventsList,
    centerBox,
    centerText,
    emptyText,
  } = ExploreStyles;

  const eventPins = events
    .filter((e) => e.geoLocation)
    .map((e) => ({
      id: e.id,
      title: e.title,
      lat: e.geoLocation!.coordinates[1],
      lng: e.geoLocation!.coordinates[0],
    }));

  const renderMap = () => {
    if (locationError) {
      return (
        <View style={[mapContainer, centerBox]}>
          <MapPin size={scale(32)} color="#CBD5E1" />
          <Text style={centerText}>
            Permita o acesso à localização{"\n"}para ver eventos próximos.
          </Text>
          <TouchableOpacity
            style={{ marginTop: 8, paddingHorizontal: 24, paddingVertical: 10,
              backgroundColor: "#EC5B13", borderRadius: 24 }}
            onPress={onRetryLocation}
          >
            <Text style={{ color: "#FFF", fontWeight: "600", fontSize: scale(14) }}>
              Tentar novamente
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={mapContainer}>
        <ExploreMap
          events={eventPins}
          userLat={userLat}
          userLng={userLng}
          onEventPress={onEventPinPress}
        />

        {/* Chips overlay */}
        <View style={[searchOverlay, { paddingTop: insets.top + 8 }]}>
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
        </View>
      </View>
    );
  };

  return (
    <View style={screen}>
      {renderMap()}

      <View style={[bottomSheet, { paddingBottom: insets.bottom + 8 }]}>
        <View style={bottomSheetHeader}>
          <Text style={bottomSheetTitle}>Perto de você</Text>
          <TouchableOpacity onPress={onViewAll}>
            <Text style={viewAllText}>VER TUDO</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator color="#EC5B13" style={{ marginTop: 24 }} />
        ) : events.length === 0 ? (
          <Text style={emptyText}>Nenhum evento encontrado na sua região.</Text>
        ) : (
          <FlatList
            data={events}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            style={{ height: 210 }}
            contentContainerStyle={eventsList}
            renderItem={({ item }) => (
              <NearbyEventCard
                id={item.id}
                title={item.title}
                date={item.date}
                location={item.location}
                category={item.category}
                bannerBase64={item.bannerBase64}
                distanceKm={item.distanceKm}
                isLiked={likedEventIds.has(item.id)}
                onToggleLike={onToggleLike}
                onViewDetail={onViewDetail}
              />
            )}
          />
        )}
      </View>
    </View>
  );
};
