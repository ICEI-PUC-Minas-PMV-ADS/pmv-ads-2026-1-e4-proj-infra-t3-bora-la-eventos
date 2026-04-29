import { View, Text } from "react-native";
import { styles } from "./PainelScreen.styles";

export default function PainelScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel</Text>
      <Text style={styles.subtitle}>Em breve</Text>
    </View>
  );
}
