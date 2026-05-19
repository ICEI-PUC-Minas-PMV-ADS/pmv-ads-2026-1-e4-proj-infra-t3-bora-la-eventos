import { IThemeTypography } from "./types";
import {scale} from '~/util/scale/'

export const typography: IThemeTypography = {
  largeTitle: scale(32),
  title: scale(24),
  subtitle: scale(18),
  body: scale(16),
  caption: scale(12),
};