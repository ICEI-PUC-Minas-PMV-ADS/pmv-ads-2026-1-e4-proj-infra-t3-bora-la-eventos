import { FC } from "react";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { Calendar, Heart, MapPin, Navigation } from "lucide-react-native";

import { scale } from "~/util/scale";
import { NearbyEventCardStyles } from "./nearby-event-card.styles";
import { TNearbyEventCardProps } from "./types";

const CATEGORY_LABELS: Record<string, string> = {
  Musica: "Música", Esporte: "Esporte", Arte: "Arte",
  Gastronomia: "Gastronomia", Tecnologia: "Tecnologia",
  Negocios: "Negócios", Festas: "Festas", Outro: "Outro",
};

function formatDistance(km: number | null): string {
  if (km === null) return "";
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

const MONTH_SHORT = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

export const NearbyEventCard: FC<TNearbyEventCardProps> = ({
  id,
  title,
  date,
  location,
  category,
  bannerBase64,
  distanceKm,
  isLiked,
  onToggleLike,
  onViewDetail,
}) => {
  const {
    card, banner, content,
    categoryBadge, categoryText,
    title: titleStyle,
    infoRow, infoText,
    bottomRow, distanceRow, distanceText,
    likeButton, likeButtonActive, likeButtonInactive,
  } = NearbyEventCardStyles;

  const eventDate = new Date(date);
  const day = eventDate.getDate();
  const month = MONTH_SHORT[eventDate.getMonth()];
  const time = eventDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const bannerUri = bannerBase64
    ? bannerBase64.startsWith("data:") ? bannerBase64 : `data:image/jpeg;base64,${bannerBase64}`
    : null;

  const categoryLabel = category ? (CATEGORY_LABELS[category] ?? category) : null;

  return (
    <TouchableOpacity style={card} onPress={() => onViewDetail(id)} activeOpacity={0.9}>
      {bannerUri
        ? <ImageBackground source={{ uri: bannerUri }} style={banner} />
        : <View style={banner} />
      }

      <View style={content}>
        {categoryLabel && (
          <View style={categoryBadge}>
            <Text style={categoryText}>{categoryLabel}</Text>
          </View>
        )}

        <Text style={titleStyle} numberOfLines={1}>{title}</Text>

        <View style={infoRow}>
          <Calendar size={scale(11)} color="#64748B" />
          <Text style={infoText} numberOfLines={1}>{day} {month} • {time}</Text>
        </View>

        {!!location && (
          <View style={infoRow}>
            <MapPin size={scale(11)} color="#64748B" />
            <Text style={infoText} numberOfLines={1}>{location}</Text>
          </View>
        )}

        <View style={bottomRow}>
          {distanceKm !== null && (
            <View style={distanceRow}>
              <Navigation size={scale(11)} color="#EC5B13" />
              <Text style={distanceText}>{formatDistance(distanceKm)} de distância</Text>
            </View>
          )}
          <TouchableOpacity
            style={[likeButton, isLiked ? likeButtonActive : likeButtonInactive]}
            onPress={() => onToggleLike(id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Heart
              size={scale(13)}
              color={isLiked ? "#EC5B13" : "#94A3B8"}
              fill={isLiked ? "#EC5B13" : "transparent"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};
