import { Calendar } from "lucide-react-native";
import { FC } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity } from "react-native";

import { scale } from "~/utils/scale";
import { Input } from "~/components/input";

import { TLoginViewProps } from "./types";
import { LoginViewStyles } from "./login.styles";
import { Button, EButtonTypes } from "~/components/button";

export const LoginView: FC<TLoginViewProps> = ({
  handleSubmit,
  handleForgotPassword,
  handleSignUp,
  handleUpdateEmail,
  handleUpdatePassword,
}) => {
  const insets = useSafeAreaInsets();
  const {
    description,
    form,
    iconContainer,
    logoWrapper,
    navigationWrapper,
    screen,
    title,
    titleWrapper,
    forgotPassword,
    signUpCommon,
    signUpCallout,
    calloutWrapper,
  } = LoginViewStyles;

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
        <View style={titleWrapper}>
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
            onChangeText: (data) => handleUpdateEmail(data),
          }}
        />
        <Input
          hasLabel
          isPassword
          label="Senha"
          inputProps={{
            placeholder: "Seua senha secreta!",
            onChangeText: (data) => handleUpdatePassword(data),
          }}
        />
      </View>

      <View style={navigationWrapper}>
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={forgotPassword}>Esqueci a senha</Text>
        </TouchableOpacity>
        <Button
          label="Entrar"
          containerProps={{
            onPress: handleSubmit, // passar os dados do form
            style: { width: "100%" },
          }}
          type={EButtonTypes.PRIMARY}
        />

        <View style={calloutWrapper}>
          <Text style={signUpCommon}>Não tem conta?</Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={signUpCallout}>Crie agora!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
