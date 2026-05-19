export interface IThemeColors {
  primary: string;
  primaryTransparent: string;
  textPrimary: string;
  textPrimaryTransparent: string;
  textSecondary: string;
  backgroundWhite: string;
}

export interface IThemeTypography {
  largeTitle: number;
  title: number;
  subtitle: number;
  body: number;
  caption: number;
}

export interface IThemeSpaces {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
}

export interface ITheme {
  colors: IThemeColors;
  typography: IThemeTypography;
  verticalSpaces: IThemeSpaces;
  horizontalSpaces: IThemeSpaces;
}

