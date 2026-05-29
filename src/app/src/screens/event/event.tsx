import { FlatList, Text, View } from "react-native";
import { EventStyles } from "./event.styles";
import { FC } from "react";
import { TEventViewProps } from "./types";
import { Loading } from "~/components/loading";
import { LikedEventCard } from "~/components/liked-event/liked-event";

export const EventView: FC<TEventViewProps> = ({
  events,
  hasMore,
  isLoading,
  onToggleLike
}) => {
  const { container } = EventStyles;

  return (
    <View style={container}>
            <Loading show={isLoading} />
            <FlatList
              style={screen}
              data={events}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{
                paddingBottom: 32,
                paddingHorizontal: 16,
              }}
              renderItem={({ item }) => (
                  <LikedEventCard
                    title={item.title}
                    date={item.date}
                    location={item.location}
                    bannerBase64={item.bannerBase64}
                    onToggleLike={onToggleLike}
                    id={item.id}
                  />
              )}
              onEndReachedThreshold={0.5}
              keyboardShouldPersistTaps="handled"
            />
    </View>
  );
};
