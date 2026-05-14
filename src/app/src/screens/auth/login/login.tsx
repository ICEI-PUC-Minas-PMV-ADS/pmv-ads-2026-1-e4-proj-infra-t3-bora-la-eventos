import { Calendar } from "lucide-react-native";
import { FC } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text } from "react-native";

import { scale } from "~/utils/scale";
import { Input } from "~/components/input";

import { TLoginViewProps } from "./types";
import { LoginViewStyles } from "./login.styles";

export const LoginView: FC<TLoginViewProps> = () => {
  const insets = useSafeAreaInsets();
  const { description, form, iconContainer, logoWrapper, screen, title } =
    LoginViewStyles;

  const renderIcon = () => {
    return (
      <View style={iconContainer}>
        <Calendar size={scale(27)} color="#EC5B13" />
      </View>
    );
  };

  return (
    <View
      style={[screen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      <View style={logoWrapper}>
        {renderIcon()}
        <View>
          <Text style={title}>Bem-vindo de volta</Text>
          <Text style={description}>
            Acesse sua conta para gerenciar e descobrir novos eventos.
          </Text>
        </View>
      </View>

      <View style={form}>
        <Input
          hasLabel
          label="Email"
          inputProps={{
            placeholder: "exemplo@email.com",
          }}
        />
        <Input
          hasLabel
          isPassword
          label="Senha"
          inputProps={{
            placeholder: "Seua senha secreta!",
          }}
        />
      </View>
    </View>
  );
};
