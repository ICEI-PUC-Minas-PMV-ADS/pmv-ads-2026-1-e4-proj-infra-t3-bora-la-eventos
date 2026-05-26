import { FC, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

import { EventMapStyles } from "./event-map.styles";
import { TEventMapProps } from "./types";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const DEFAULT_DELTA = 0.01;

export const EventMap: FC<TEventMapProps> = ({ address }) => {
  const { container, map, loadingContainer, loadingText } = EventMapStyles;

  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const query = `${address.street}, ${address.number}, ${address.city}, ${address.state}, ${address.zipCode}`;
    fetch(
      `${NOMINATIM_URL}?q=${encodeURIComponent(query)}&format=json&limit=1`,
      { headers: { "Accept-Language": "pt-BR" } },
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setCoords({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
        } else {
          setFailed(true);
        }
      })
      .catch(() => setFailed(true));
  }, [address]);

  if (failed) {
    return (
      <View style={[container, loadingContainer]}>
        <Text style={loadingText}>Localização não encontrada.</Text>
      </View>
    );
  }

  if (!coords) {
    return (
      <View style={[container, loadingContainer]}>
        <ActivityIndicator color="#EC5B13" />
      </View>
    );
  }

  return (
    <View style={container}>
      <MapView
        style={map}
        region={{
          latitude: coords.lat,
          longitude: coords.lng,
          latitudeDelta: DEFAULT_DELTA,
          longitudeDelta: DEFAULT_DELTA,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
      >
        <Marker coordinate={{ latitude: coords.lat, longitude: coords.lng }} />
      </MapView>
    </View>
  );
};
