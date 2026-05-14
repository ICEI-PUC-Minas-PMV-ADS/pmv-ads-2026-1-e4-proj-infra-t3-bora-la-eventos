import { FC, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Eye, EyeClosed } from "lucide-react-native";

import { TInputProps } from "./types";
import { InputStyles } from "./input.styles";
import { scale } from "~/utils/scale";

export const Input: FC<TInputProps> = (props) => {
  const [isSecureContent, setIsSecureContent] = useState(props.isPassword);
  const { label, input, container, pressable } = InputStyles;

  const renderLabel = () => {
    if (props.hasLabel) {
      return <Text style={[label, props.labelStyles]}>{props.label}</Text>;
    }
    return <></>;
  };

  const handleIconPress = () => {
    setIsSecureContent(!isSecureContent);
  }

  const renderHideContentButton = () => {
    return (
      <TouchableOpacity
        onPress={() => handleIconPress()}
        style={pressable}
      >
        {props.isPassword && isSecureContent ? (
          <EyeClosed size={scale(20)} color={"#94A3B8"} />
        ) : (
          <Eye size={scale(20)} color={"#94A3B8"} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View
      {...props.containerProps}
      style={[container, props.containerProps?.style]}
    >
      {renderLabel()}
      <View style={{ position: "relative" }}>
        <TextInput
          placeholderTextColor="#CBD5E1"
          {...props.inputProps}
          style={[input, props.inputProps.style]}
          secureTextEntry={isSecureContent}
        />
        {props.isPassword && renderHideContentButton()}
      </View>
    </View>
  );
};
