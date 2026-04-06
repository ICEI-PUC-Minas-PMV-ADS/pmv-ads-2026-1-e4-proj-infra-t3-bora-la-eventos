import { StyleSheet, Text, View } from "react-native";
import MapView, { UrlTile } from "react-native-maps";

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>Open up App.tsx to start working on your app!</Text>
      </View>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: -23.160959,
          longitude: -45.918067,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
      >
        <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={5}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  header: {
    height: 20,
    marginBottom: 10,
  },
  mapContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
