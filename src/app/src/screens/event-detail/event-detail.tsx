import { FC, useState } from "react";
import {
  FlatList,
  TextInput,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Heart,
  MapPin,
  Users,
} from "lucide-react-native";

import { Button, EButtonTypes } from "~/components/button";
import { EventMap } from "~/components/event-map";
import { scale } from "~/util/scale";
import { EventDetailStyles } from "./event-detail.styles";
import { TComment, TEventDetailViewProps } from "./types";

const MONTH_SHORT = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export const EventDetailView: FC<TEventDetailViewProps> = ({
  event,
  isLiked,
  onToggleLike,
  onBack,
  comments,
  sendComment
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

  const [commentText, setCommentText] = useState("");
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

          <View style={divider} />

          <View style={{ marginTop: 8 }}>
            <Text style={sectionTitle}>Comentários</Text>

            <FlatList
              data={comments}
              scrollEnabled={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ gap: 12, marginTop: 12 }}
              renderItem={({ item }) => (
                <View
                  style={{
                    padding: 12,
                    borderWidth: 1,
                    borderColor: "#E2E8F0",
                    borderRadius: 12,
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "700",
                      marginBottom: 6,
                      color: "#0F172A",
                    }}
                  >
                    Usuário
                  </Text>

                  <Text style={{ color: "#334155" }}>{item.text}</Text>

                  <Text
                    style={{
                      marginTop: 8,
                      fontSize: 12,
                      color: "#94A3B8",
                    }}
                  >
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              )}
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginTop: 16,
              }}
            >
              <TextInput
                value={commentText}
                onChangeText={setCommentText}
                placeholder="Digite um comentário..."
                placeholderTextColor="#94A3B8"
                style={{
                  flex: 1,
                  height: 48,
                  borderWidth: 1,
                  borderColor: "#CBD5E1",
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  backgroundColor: "#FFFFFF",
                }}
              />

              <TouchableOpacity
                style={{
                  height: 48,
                  paddingHorizontal: 18,
                  borderRadius: 12,
                  backgroundColor: "#0F172A",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {sendComment(commentText)}}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontWeight: "700",
                  }}
                >
                  Enviar
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {event.address && (
            <>
              <View style={divider} />
              <View style={{ gap: 10 }}>
                <Text style={sectionTitle}>Localização</Text>
                <EventMap address={event.address} />
                <View style={infoRow}>
                  <MapPin size={scale(14)} color="#475569" />
                  <Text style={infoText}>
                    {event.address.street}
                    {event.address.number
                      ? `, ${event.address.number}`
                      : ""} — {event.address.city}, {event.address.state}
                    {event.address.zipCode
                      ? ` • CEP ${event.address.zipCode}`
                      : ""}
                  </Text>
                </View>
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
