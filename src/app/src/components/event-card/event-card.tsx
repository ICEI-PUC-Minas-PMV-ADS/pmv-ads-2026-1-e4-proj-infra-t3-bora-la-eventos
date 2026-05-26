import { FC } from "react";
import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import { Calendar, Heart, MapPin } from "lucide-react-native";

import { Button, EButtonTypes } from "~/components/button";
import { scale } from "~/util/scale";
import { EventCardStyles } from "./event-card.styles";
import { TEventCardProps } from "./types";

const MONTH_LABELS = [
  "JAN","FEV","MAR","ABR","MAI","JUN",
  "JUL","AGO","SET","OUT","NOV","DEZ",
];

export const EventCard: FC<TEventCardProps> = ({
  id,
  title,
  date,
  location,
  category,
  bannerBase64,
  isLiked,
  onToggleLike,
  onViewDetail,
}) => {
  const {
    card,
    banner,
    dateBadge,
    monthText,
    dayText,
    topRightRow,
    viewAllButton,
    viewAllText,
    heartButton,
    content,
    titleRow,
    titleText,
    categoryBadge,
    categoryText,
    infoBlock,
    infoRow,
    infoText,
  } = EventCardStyles;

  const eventDate = new Date(date);
  const month = MONTH_LABELS[eventDate.getMonth()];
  const day = String(eventDate.getDate());
  const formattedDate = eventDate.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const formattedTime = eventDate.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const renderBannerOverlays = () => (
    <>
      <View style={dateBadge}>
        <Text style={monthText}>{month}</Text>
        <Text style={dayText}>{day}</Text>
      </View>
      <View style={topRightRow}>
        <TouchableOpacity style={viewAllButton} onPress={() => onViewDetail(id)}>
          <Text style={viewAllText}>VER TUDO</Text>
        </TouchableOpacity>
        <View style={heartButton}>
          <Heart size={scale(12)} color="#FFFFFF" />
        </View>
      </View>
    </>
  );

  const bannerUri = bannerBase64
    ? bannerBase64.startsWith("data:")
      ? bannerBase64
      : `data:image/jpeg;base64,${bannerBase64}`
    : null;

  return (
    <View style={card}>
      {bannerUri ? (
        <ImageBackground
          source={{ uri: bannerUri }}
          style={banner}
          onError={() => console.warn("[EventCard] falha ao carregar banner:", bannerUri?.substring(0, 40))}
        >
          {renderBannerOverlays()}
        </ImageBackground>
      ) : (
        <View style={banner}>{renderBannerOverlays()}</View>
      )}

      <View style={content}>
        <View style={titleRow}>
          <Text style={titleText} numberOfLines={2}>
            {title}
          </Text>
          {category && (
            <View style={categoryBadge}>
              <Text style={categoryText}>{category}</Text>
            </View>
          )}
        </View>

        <View style={infoBlock}>
          <View style={infoRow}>
            <Calendar size={scale(14)} color="#475569" />
            <Text style={infoText}>
              {formattedDate} • {formattedTime}
            </Text>
          </View>
          <View style={infoRow}>
            <MapPin size={scale(14)} color="#475569" />
            <Text style={infoText} numberOfLines={1}>
              {location}
            </Text>
          </View>
        </View>

        <Button
          label={isLiked ? "Interessado" : "Tenho Interesse"}
          type={isLiked ? EButtonTypes.SECONDARY : EButtonTypes.PRIMARY}
          containerProps={{
            onPress: () => onToggleLike(id),
            style: { width: "100%" },
          }}
        />
      </View>
    </View>
  );
};
