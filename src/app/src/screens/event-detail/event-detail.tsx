import { FC } from "react";
import {
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, Calendar, Clock, Heart, MapPin, Users } from "lucide-react-native";

import { Button, EButtonTypes } from "~/components/button";
import { EventMap } from "~/components/event-map";
import { scale } from "~/util/scale";
import { EventDetailStyles } from "./event-detail.styles";
import { TEventDetailViewProps } from "./types";

const MONTH_SHORT = [
  "Jan","Fev","Mar","Abr","Mai","Jun",
  "Jul","Ago","Set","Out","Nov","Dez",
];

export const EventDetailView: FC<TEventDetailViewProps> = ({
  event,
  isLiked,
  onToggleLike,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const {
    screen,
    banner,
    headerOverlay,
    iconButton,
    headerRight,
    content,
    title,
    locationLine,
    infoRow,
    infoText,
    divider,
    sectionTitle,
    description,
    infoBoxRow,
    infoBox,
    infoBoxLabel,
    infoBoxRow2,
    infoBoxValue,
    participantsRow,
    participantsText,
    participantsCount,
    footer,
  } = EventDetailStyles;

  const eventDate = new Date(event.date);
  const day = String(eventDate.getDate()).padStart(2, "0");
  const formattedDate = `${day} ${MONTH_SHORT[eventDate.getMonth()]}, ${eventDate.getFullYear()}`;
  const formattedTime = eventDate.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const bannerUri = event.bannerBase64
    ? event.bannerBase64.startsWith("data:")
      ? event.bannerBase64
      : `data:image/jpeg;base64,${event.bannerBase64}`
    : null;

  const renderBanner = () => {
    const overlays = (
      <View style={[headerOverlay, { paddingTop: insets.top }]}>
        <TouchableOpacity style={iconButton} onPress={onBack}>
          <ArrowLeft size={scale(18)} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={headerRight}>
          <TouchableOpacity style={iconButton} onPress={onToggleLike}>
            <Heart
              size={scale(18)}
              color={isLiked ? "#EC5B13" : "#FFFFFF"}
              fill={isLiked ? "#EC5B13" : "transparent"}
            />
          </TouchableOpacity>
        </View>
      </View>
    );

    return bannerUri ? (
      <ImageBackground source={{ uri: bannerUri }} style={banner}>
        {overlays}
      </ImageBackground>
    ) : (
      <View style={banner}>{overlays}</View>
    );
  };

  return (
    <View style={screen}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {renderBanner()}

        <View style={content}>
          <Text style={title}>{event.title}</Text>

          <View style={infoRow}>
            <MapPin size={scale(14)} color="#475569" />
            <Text style={locationLine}>{event.location}</Text>
          </View>

          <View style={divider} />

          <View style={infoBoxRow}>
            <View style={infoBox}>
              <Text style={infoBoxLabel}>Data</Text>
              <View style={infoBoxRow2}>
                <Calendar size={scale(14)} color="#475569" />
                <Text style={infoBoxValue}>{formattedDate}</Text>
              </View>
            </View>
            <View style={infoBox}>
              <Text style={infoBoxLabel}>Hora</Text>
              <View style={infoBoxRow2}>
                <Clock size={scale(14)} color="#475569" />
                <Text style={infoBoxValue}>{formattedTime}</Text>
              </View>
            </View>
          </View>

          <View style={divider} />

          <View style={participantsRow}>
            <Users size={scale(14)} color="#475569" />
            <Text style={participantsText}>
              <Text style={participantsCount}>{event.participantsCount}</Text>{" "}
              pessoas demonstraram interesse
            </Text>
          </View>

          <View style={divider} />

          <View>
            <Text style={sectionTitle}>Sobre o Evento</Text>
            <Text style={description}>{event.description}</Text>
          </View>

          {event.address && (
            <>
              <View style={divider} />
              <View>
                <Text style={sectionTitle}>Localização</Text>
                <EventMap address={event.address} />
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <View style={[footer, { paddingBottom: insets.bottom + 16 }]}>
        <Button
          label={isLiked ? "Interessado" : "Tenho Interesse"}
          type={isLiked ? EButtonTypes.SECONDARY : EButtonTypes.DARK}
          containerProps={{ onPress: onToggleLike, style: { width: "100%" } }}
        />
      </View>
    </View>
  );
};
