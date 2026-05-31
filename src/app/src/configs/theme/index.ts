import { colors } from "./colors";
import { typography } from "./typography";
import { horizontalSpaces, verticalSpaces } from "./spaces";
import { ITheme } from "./types";

export const theme: ITheme = {
  colors,
  typography,
  horizontalSpaces,
  verticalSpaces,
};
export type { ITheme, IThemeColors, IThemeTypography } from "./types";
