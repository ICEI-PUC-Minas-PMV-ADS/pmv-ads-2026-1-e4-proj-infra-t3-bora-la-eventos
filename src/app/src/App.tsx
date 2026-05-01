import { useState } from "react";
import { View } from "react-native";
import Sidebar, { Screen } from "./components/Sidebar";
import CriarEventoScreen from "./screens/Painel/PainelScreen";
import EventosScreen from "./screens/Eventos/EventosScreen";
import { styles } from "./App.styles";

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>("Eventos");

  return (
    <View style={styles.container}>
      <Sidebar activeScreen={activeScreen} onNavigate={setActiveScreen} />
      <View style={styles.content}>
        {activeScreen === "Criar Evento" ? <CriarEventoScreen /> : <EventosScreen />}
      </View>
    </View>
  );
}
