import { Text, View } from "react-native";
import { EventStyles } from "./event.styles";

export const EventView = () => {
  const { container } = EventStyles;
  return (
    <View style={container}>
      <Text>Event View</Text>
    </View>
  );
};
