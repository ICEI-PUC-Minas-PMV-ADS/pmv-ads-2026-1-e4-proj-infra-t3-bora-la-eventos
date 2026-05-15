import { FC } from "react";
import { Text, TouchableOpacity } from "react-native";
import { TButtonViewProps } from "./types";

/**
 * O arquivo que leva o nome da pasta é a camada de visualização. Esse arquivo
 * quando possível, não deve conter lógica para que se mantenha a separação.
 * Lembre-se de que isso é uma recomendação e podem haver casos onde não
 * há outro caminho. Se necessário por, adicione apenas o estritamente necessário.
 */
export const ButtonView: FC<TButtonViewProps> = ({
  children,
  typeStyle,
  containerProps,
  labelProps,
}) => {
  return (
    <TouchableOpacity
      {...containerProps}
      style={[typeStyle.containerStyle, containerProps?.style]}
    >
      <Text {...labelProps} style={[typeStyle.labelStyle, labelProps?.style]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};
