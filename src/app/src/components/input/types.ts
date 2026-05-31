import { TextInputProps, TextStyle, ViewProps } from "react-native";

export type TInputBaseProps = {
  containerProps?: ViewProps;
  inputProps: TextInputProps;
  isPassword?: boolean,
};

type TInputWithLabelProps = {
  hasLabel: true;
  label: string;
  labelStyles?: TextStyle;
};

type TInputWithoutLabelProps = {
  hasLabel?: false;
};

export type TInputProps =
  TInputBaseProps &
  (
    | TInputWithLabelProps
    | TInputWithoutLabelProps
  );