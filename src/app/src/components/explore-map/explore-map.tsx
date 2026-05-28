import { FC, useCallback, useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import WebView, { WebViewMessageEvent } from "react-native-webview";

import { TEventPin, TExploreMapProps } from "./types";

const EXPLORE_MAP_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; }
    .user-marker {
      width: 18px; height: 18px;
      background: #3B82F6;
      border: 3px solid #FFFFFF;
      border-radius: 50%;
      box-shadow: 0 0 0 4px rgba(59,130,246,0.25);
    }
    .event-marker {
      width: 32px; height: 32px;
      background: #EC5B13;
      border: 2px solid #FFFFFF;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      cursor: pointer;
    }
    .event-marker svg { width: 16px; height: 16px; fill: white; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var map = L.map('map', { zoomControl: false }).setView([-15.8, -47.9], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    var userIcon = L.divIcon({
      html: '<div class="user-marker"></div>',
      iconSize: [18, 18],
      iconAnchor: [9, 9],
      className: ''
    });

    var eventIcon = L.divIcon({
      html: '<div class="event-marker"><svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg></div>',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      className: ''
    });

    window._userMarker = null;
    window._eventMarkers = [];

    // Chamada via injectJavaScript pelo React Native após obter localização com expo-location
    window._addUserMarker = function(lat, lng) {
      if (window._userMarker) { map.removeLayer(window._userMarker); }
      map.setView([lat, lng], 13);
      window._userMarker = L.marker([lat, lng], { icon: userIcon })
        .bindPopup('Você está aqui')
        .addTo(map);
    };
  </script>
</body>
</html>
`;

function buildInjectMarkersJs(pins: TEventPin[]): string {
  return `
    (function() {
      if (typeof L === 'undefined' || typeof map === 'undefined') return;
      if (window._eventMarkers) {
        window._eventMarkers.forEach(function(m) { map.removeLayer(m); });
      }
      window._eventMarkers = [];
      var pins = ${JSON.stringify(pins)};
      pins.forEach(function(event) {
        var m = L.marker([event.lat, event.lng], { icon: eventIcon })
          .bindPopup('<b>' + event.title + '</b>')
          .on('click', function() {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ type: 'pinClick', eventId: event.id })
            );
          })
          .addTo(map);
        window._eventMarkers.push(m);
      });
    })();
    true;
  `;
}

export const ExploreMap: FC<TExploreMapProps> = ({
  events,
  userLat,
  userLng,
  onEventPress,
}) => {
  const webViewRef = useRef<WebView>(null);
  const mapReady = useRef(false);

  // Refs para capturar os valores mais recentes dentro de handleLoadEnd (closure-safe)
  const userLatRef = useRef(userLat);
  const userLngRef = useRef(userLng);
  const eventsRef = useRef(events);

  useEffect(() => { userLatRef.current = userLat; }, [userLat]);
  useEffect(() => { userLngRef.current = userLng; }, [userLng]);
  useEffect(() => { eventsRef.current = events; }, [events]);

  // Quando as coordenadas do usuário chegam após o mapa já estar pronto
  useEffect(() => {
    if (!mapReady.current || userLat === undefined || userLng === undefined) return;
    webViewRef.current?.injectJavaScript(
      `window._addUserMarker(${userLat}, ${userLng}); true;`
    );
  }, [userLat, userLng]);

  // Quando a lista de eventos muda após o mapa já estar pronto
  useEffect(() => {
    if (!mapReady.current) return;
    webViewRef.current?.injectJavaScript(buildInjectMarkersJs(events));
  }, [events]);

  // Leaflet carregou — injeta coordenadas e marcadores se já disponíveis
  const handleLoadEnd = useCallback(() => {
    mapReady.current = true;
    const lat = userLatRef.current;
    const lng = userLngRef.current;
    if (lat !== undefined && lng !== undefined) {
      webViewRef.current?.injectJavaScript(
        `window._addUserMarker(${lat}, ${lng}); true;`
      );
    }
    if (eventsRef.current.length > 0) {
      webViewRef.current?.injectJavaScript(buildInjectMarkersJs(eventsRef.current));
    }
  }, []);

  const handleMessage = useCallback(
    (e: WebViewMessageEvent) => {
      try {
        const msg = JSON.parse(e.nativeEvent.data);
        if (msg.type === "pinClick") {
          onEventPress?.(msg.eventId);
        }
      } catch {
        // mensagem inválida — ignora
      }
    },
    [onEventPress],
  );

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: EXPLORE_MAP_HTML }}
        style={StyleSheet.absoluteFill}
        scrollEnabled={false}
        originWhitelist={["*"]}
        onLoadEnd={handleLoadEnd}
        onMessage={handleMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
