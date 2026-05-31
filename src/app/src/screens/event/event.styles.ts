import { StyleSheet } from "react-native";

export const EventStyles = StyleSheet.create({
  /**
   * ERRO AO NAVEGAR PARA A TELA 'Meus Eventos'
   * O erro se de pois a propriedade screen, abaixo, não foi definida
   * Precisei fazer a mudança de última hora para correigir a falha
   */
  screen: {},
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  },
});
