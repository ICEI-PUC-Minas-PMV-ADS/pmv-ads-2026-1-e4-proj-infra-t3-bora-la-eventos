import { View, Text } from "react-native";
import { styles } from "./EventosScreen.styles";

export default function EventosScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eventos</Text>
      <Text style={styles.subtitle}>Em breve</Text>
    </View>
  );
}
