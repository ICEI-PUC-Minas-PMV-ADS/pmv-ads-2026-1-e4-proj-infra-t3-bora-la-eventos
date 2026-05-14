import { Dimensions } from "react-native";

const GUIDE_LINE_WIDTH = 390;
const GUIDE_LINE_HEIGHT = 902;
const { width, height } = Dimensions.get("screen");

/**
 * Utilitário para escalar valores horizontalmente conforme a proporção
 * do dispositivo
 * @param size Valor desejado 
 * @returns Valor escalonado
 */
export const horizontalScale = (size: number) =>
  (width / GUIDE_LINE_WIDTH) * size;

/**
 * Utilitário para escalar valores verticalmente conforme a proporção
 * do dispositivo
 * @param size Valor desejado 
 * @returns Valor escalonado
 */
export const verticalScale = (size: number) =>
  (height / GUIDE_LINE_HEIGHT) * size;

/**
 * Utilitário para ajustar font-size de modo que os tamanhos
 * fiquem consistentes entre diferentes dispositivos
 * @param size Valor desejado
 * @param factor? Default é 0.5 mas pode ser customizado se necessário.
 * @returns Valor ajustado conforme as proporções do dispositivo.
 */
export const scale = (size: number, factor?: number) => {
  return size + (horizontalScale(size) - size) * (factor ?? 0.5);
};