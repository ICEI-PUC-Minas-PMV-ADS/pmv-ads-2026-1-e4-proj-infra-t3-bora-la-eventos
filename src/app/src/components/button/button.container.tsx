import { FC } from "react";

import { ButtonView } from "./button";
import { TButtonProps, EButtonTypes } from "./types";
import {
  PrimaryStyles,
  SecondaryStyles,
  TertiaryStyles,
  PrimaryStylesOutline,
  DarkStyles,
} from "./button.styles";

/**
 * O arquivo .container sempre irá conter apenas lógica. Procure manter tomadas
 * de decisão, manipulação de dados e estados ou qualquer outro tipo de lógica dentro desse
 * arquivo, quando julgar necessário.
 */
export const Button: FC<TButtonProps> = ({
  containerProps,
  label,
  labelProps,
  type,
}) => {
  // Exemplo de tomada de decisão baseada no tipo de botão enviado
  const getButtonStyle = () => {
    switch (type) {
      case EButtonTypes.PRIMARY:
        return PrimaryStyles;
      case EButtonTypes.SECONDARY:
        return SecondaryStyles;
      case EButtonTypes.TERTIARY:
        return TertiaryStyles;
      case EButtonTypes.PRIMARY_OUTLINE:
        return PrimaryStylesOutline;
      case EButtonTypes.DARK:
        return DarkStyles;
    }
  };
  // onPress={props.onPress} style={getButtonStyle()}
  return (
    <ButtonView
      containerProps={containerProps}
      labelProps={labelProps}
      typeStyle={getButtonStyle()}
    >
      {label}
    </ButtonView>
  );
};
