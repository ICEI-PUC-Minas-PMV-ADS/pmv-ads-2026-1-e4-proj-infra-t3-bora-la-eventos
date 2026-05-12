import { ReactNode } from "react";
import { TextStyle, ViewStyle } from "react-native";

/**
 * Este é um arquivo de tipos. Typescript exige que os dados 
 * do código sejam declarados e este arquivo deve concentrar 
 * tudos os tipos pertinentes, neste caso, ao botão.
 */

// Enums são formas simples de tiparmos padrões conhecidos que,
// na maioria dos casos, não deveria mudar. Porém, ao usarmos enums,
// uma possível mudança dentro do elemento fica mais simples e rápida de se encontrar.
export enum EButtonTypes {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
  PRIMARY_OUTLINE = 'primary-outline',
}

/**
 * Typescript suporte "types" e "interfaces". É bem commum das pessoas não saberem 
 * diferenciar quando usar um ou outro ja que, no geral, ambos são bem semelhantes. 
 * A diferênça é bem mais semântica e implica pouco em código, mas por via de regras
 * a menos que esteja criando uma padronização para um componente, como em uma classe, 
 * o mais usual é utilizar um "type" pois ele implica apenas na tipagem dos elementos
 * enquanto que interfaces sugerem algo mais estático, que não possibilita mudança. 
 */

// Existe uma boa parática que sugere que o nome de tipos/types sejam precedidos de T
// para facilitar a identificação, como no caso abaixo. Outros exemplos seriam:
// TListProps, TListTypes, TList, etc. 
// Para interfaces, segue-se a mesma idéia:
// IHomeProps, IHomeInterface, IHome, etc.
export type TButtonViewProps = {
  children: ReactNode;
  onPress: () => unknown;
  style: {
    labelStyle: TextStyle,
    containerStyle: ViewStyle 
  }
}

export type TButtonProps = {
  label: string;
  type: EButtonTypes;
  onPress: () => unknown;
}