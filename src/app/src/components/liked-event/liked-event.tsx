import { FC } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";

import {
  Calendar,
  MoreVertical,
  Trash,
} from "lucide-react-native";

import { scale } from "~/util/scale";

type Props = {
  id: string
  title: string;
  location: string;
  date: string;
  bannerBase64?: string;
  onToggleLike: (eventId: string) => void;
  badge?: "VOCÊ" | "INTERESSADO";
  onPressMenu?: () => void;
};

export const LikedEventCard: FC<Props> = ({
  id,
  title,
  location,
  date,
  bannerBase64,
  badge,
  onPressMenu,
  onToggleLike
}) => {
  const eventDate = new Date(date);

  const formattedDate = eventDate.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });

  const formattedTime = eventDate.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const getBannerUri = () => {
    if (!bannerBase64) return undefined;

    if (bannerBase64.startsWith("data:")) {
      return bannerBase64;
    }

    return `data:image/jpeg;base64,${bannerBase64}`;
  };

  return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: scale(12),
          backgroundColor: "#FFF",
          borderRadius: scale(14),
          marginBottom: scale(10),
          gap: 20,
          width: "100%",
        }}
      >
      <Image
        source={
          getBannerUri()
            ? { uri: getBannerUri() }
            : undefined
        }
        style={{
          width: scale(72),
          height: scale(72),
          borderRadius: scale(12),
          backgroundColor: "#CBD5E1",
        }}
      />

      <View
        style={{
          flex: 1,
          minWidth: 0,
          marginHorizontal: scale(12),
        }}
      >
        {badge && (
          <View
            style={{
              alignSelf: "flex-start",
              backgroundColor:
                badge === "VOCÊ"
                  ? "#FFEDD5"
                  : "#E2E8F0",
              paddingHorizontal: scale(8),
              paddingVertical: scale(3),
              borderRadius: scale(999),
              marginBottom: scale(6),
            }}
          >
            <Text
              style={{
                fontSize: scale(10),
                fontWeight: "700",
                color:
                  badge === "VOCÊ"
                    ? "#EA580C"
                    : "#475569",
              }}
            >
              {badge}
            </Text>
          </View>
        )}

        <Text
          numberOfLines={1}
          style={{
            fontSize: scale(16),
            fontWeight: "700",
            color: "#0F172A",
          }}
        >
          {title}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: scale(4),
          }}
        >
          <Calendar
            size={scale(13)}
            color="#64748B"
          />

          <Text
            style={{
              marginLeft: scale(4),
              fontSize: scale(13),
              color: "#475569",
            }}
          >
            {formattedDate} • {formattedTime}
          </Text>
        </View>

        <Text
          numberOfLines={1}
          style={{
            marginTop: scale(4),
            fontSize: scale(13),
            color: "#94A3B8",
          }}
        >
          {location}
        </Text>
      </View>

      <TouchableOpacity onPress={() => { onToggleLike(id)}}>
        <Trash           size={scale(18)}
          color="#64748B"></Trash>
      </TouchableOpacity>
    </View>
  );
};