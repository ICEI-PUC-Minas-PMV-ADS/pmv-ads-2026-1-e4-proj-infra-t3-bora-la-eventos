import { IThemeSpaces } from "./types";
import { verticalScale, horizontalScale } from "~/util/scale";

export const verticalSpaces: IThemeSpaces = {
  xs: verticalScale(4),
  sm: verticalScale(8),
  md: verticalScale(16),
  lg: verticalScale(24),
  xl: verticalScale(32),
  xxl: verticalScale(40),
  xxxl: verticalScale(80),
} 
export const horizontalSpaces: IThemeSpaces = {
  xs: horizontalScale(4),
  sm: horizontalScale(8),
  md: horizontalScale(16),
  lg: horizontalScale(24),
  xl: horizontalScale(32),
  xxl: horizontalScale(40),
  xxxl: horizontalScale(80),
}
