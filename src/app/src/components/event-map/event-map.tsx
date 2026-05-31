import { FC, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import WebView from "react-native-webview";

import { EventMapStyles } from "./event-map.styles";
import { TEventMapProps } from "./types";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

function buildLeafletHtml(lat: number, lng: number): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var map = L.map('map', { zoomControl: false, dragging: false, scrollWheelZoom: false })
      .setView([${lat}, ${lng}], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    var icon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    L.marker([${lat}, ${lng}], { icon: icon }).addTo(map);
  </script>
</body>
</html>
`;
}

export const EventMap: FC<TEventMapProps> = ({ address }) => {
  const { container, loadingContainer, loadingText } = EventMapStyles;

  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const fetchCoords = async () => {
      const headers = {
        "Accept-Language": "pt-BR",
        "User-Agent": "BoraLaEventos/1.0 (contato@borala.app)",
      };

      // Tenta primeiro com endereço completo
      const fullQuery = `${address.street}, ${address.number}, ${address.city}, ${address.state}, Brasil`;
      try {
        const res = await fetch(
          `${NOMINATIM_URL}?q=${encodeURIComponent(fullQuery)}&format=json&limit=1&countrycodes=br`,
          { headers },
        );
        const data = await res.json();
        if (data.length > 0) {
          setCoords({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
          return;
        }
      } catch {}

      // Fallback: busca só pela cidade e estado
      const fallbackQuery = `${address.city}, ${address.state}, Brasil`;
      try {
        const res = await fetch(
          `${NOMINATIM_URL}?q=${encodeURIComponent(fallbackQuery)}&format=json&limit=1&countrycodes=br`,
          { headers },
        );
        const data = await res.json();
        if (data.length > 0) {
          setCoords({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
          return;
        }
      } catch {}

      setFailed(true);
    };

    fetchCoords();
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
      <WebView
        source={{ html: buildLeafletHtml(coords.lat, coords.lng) }}
        style={{ flex: 1 }}
        scrollEnabled={false}
        originWhitelist={["*"]}
      />
    </View>
  );
};
