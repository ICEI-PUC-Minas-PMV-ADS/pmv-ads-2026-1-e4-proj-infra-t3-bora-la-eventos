import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles, ORANGE } from "./Sidebar.styles";

export type Screen = "Criar Evento" | "Eventos";

type Props = {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
};

const menuItems: { name: Screen; icon: keyof typeof Ionicons.glyphMap }[] = [
  { name: "Criar Evento", icon: "add-circle-outline" },
  { name: "Eventos", icon: "calendar-outline" },
];

export default function Sidebar({ activeScreen, onNavigate }: Props) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconWrapper}>
          <Ionicons name="storefront-outline" size={22} color={ORANGE} />
        </View>
        <View>
          <Text style={styles.headerTitle}>GERENTE DO LOCAL</Text>
          <Text style={styles.headerSubtitle}>Admin do Estabelecimento</Text>
        </View>
      </View>

      {/* Menu */}
      <View style={styles.menu}>
        {menuItems.map((item) => {
          const isActive = activeScreen === item.name;
          return (
            <TouchableOpacity
              key={item.name}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => onNavigate(item.name)}
            >
              <Ionicons
                name={item.icon}
                size={18}
                color={isActive ? ORANGE : "#9ca3af"}
              />
              <Text
                style={[styles.menuItemText, isActive && styles.menuItemTextActive]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={18} color="#fff" />
        </View>
        <View style={styles.footerText}>
          <Text style={styles.footerName}>Alex Rivera</Text>
          <Text style={styles.footerRole} numberOfLines={1}>
            Proprietário do Estabeleci...
          </Text>
        </View>
      </View>
    </View>
  );
}
