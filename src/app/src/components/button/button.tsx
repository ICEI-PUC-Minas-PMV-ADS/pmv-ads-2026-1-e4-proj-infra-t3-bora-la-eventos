import { FC } from 'react';
import { Text, TouchableOpacity, } from 'react-native';
import { TButtonViewProps } from './types';

/**
 * O arquivo que leva o nome da pasta é a camada de visualização. Esse arquivo
 * quando possível, não deve conter lógica para que se mantenha a separação.
 * Lembre-se de que isso é uma recomendação e podem haver casos onde não 
 * há outro caminho. Se necessário por, adicione apenas o estritamente necessário. 
 */
export const ButtonView: FC<TButtonViewProps> = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress} style={props.style.containerStyle}>
      <Text style={props.style.labelStyle}>{props.children}</Text>
    </TouchableOpacity>
  )
}

