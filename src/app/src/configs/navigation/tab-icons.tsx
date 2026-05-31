import { Text } from "react-native";
import { Home, UserCircle2 as User, CalendarCheck as Event } from "lucide-react-native";

import { scale } from "~/util/scale";
import { theme } from "../theme";

interface ITabIconProps {
  focused: boolean;
  color: string;
  size: number;
}

interface ITabLabelProps {
  focused: boolean;
  color: string;
  position: "beside-icon" | "below-icon";
  children: string;
}

enum IconType {
  USER = 'user',
  HOME = 'home',
  EVENT = 'event',
}

const renderIcon = (type: IconType, isFocused: boolean) => {
  const { size, color } = getFocusedProps(isFocused)
  switch (type) {
    case IconType.USER:
      return <User size={size} color={color} />
    case IconType.HOME:
      return <Home size={size} color={color} />
    case IconType.EVENT:
      return <Event size={size} color={color} />
  }
}

const renderLabel = (props: ITabLabelProps) => {
  const { color, fontSize } = getFocusedProps(props.focused);
  return <Text style={{ fontSize, color }}>{props.children}</Text>;
};

const getFocusedProps = (isFocused: boolean) => ({
  size: isFocused ? scale(26) : scale(20),
  fontSize: isFocused ? scale(14) : scale(12),
  color: isFocused ? theme.colors.primary : theme.colors.textSecondary,
});

export {renderIcon, renderLabel, IconType}
