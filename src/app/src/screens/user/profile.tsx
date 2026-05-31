import { FC } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, EButtonTypes } from "~/components/button";
import { Input } from "~/components/input";
import { TProfileViewProps } from "./types";
import { ProfileStyles } from "./profile.styles";
import { theme } from "~/configs/theme";

export const ProfileView: FC<TProfileViewProps> = ({
  email,
  handleSubmit,
  handleUpdateEmail,
  handleUpdateName,
  handleUpdatePassword,
  name,
  password,
}) => {
  const insets = useSafeAreaInsets();
  const nameParts = name.trim().split(/\s+/).filter(Boolean);
  const avatarInitials =
    nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[1][0]}`
      : nameParts[0]?.slice(0, 2) || "US";
  const {
    avatar,
    avatarText,
    button,
    content,
    description,
    form,
    screen,
    title,
    titleWrapper,
  } = ProfileStyles;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 0}
      style={screen}
    >
      <ScrollView
        contentContainerStyle={[
          content,
          {
            paddingTop: insets.top + theme.verticalSpaces.xl,
            paddingBottom: insets.bottom + theme.verticalSpaces.xxl,
          },
        ]}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={titleWrapper}>
          <View style={avatar}>
            <Text style={avatarText}>{avatarInitials.toUpperCase()}</Text>
          </View>
          <Text style={title}>Meu Perfil</Text>
          <Text style={description}>
            Atualize seus dados para manter sua conta sempre em dia.
          </Text>
        </View>

        <View style={form}>
          <Input
            hasLabel
            label="Nome completo"
            inputProps={{
              autoCapitalize: "words",
              onChangeText: handleUpdateName,
              placeholder: "Seu nome",
              value: name,
            }}
          />
          <Input
            hasLabel
            label="E-mail"
            inputProps={{
              autoCapitalize: "none",
              keyboardType: "email-address",
              onChangeText: handleUpdateEmail,
              placeholder: "seuemail@exemplo.com",
              value: email,
            }}
          />
          <Input
            hasLabel
            isPassword
            label="Nova senha"
            inputProps={{
              onChangeText: handleUpdatePassword,
              placeholder: "Mínimo 8 caracteres",
              value: password,
            }}
          />
        </View>

        <Button
          label="Salvar alterações"
          containerProps={{
            onPress: handleSubmit,
            style: button,
          }}
          type={EButtonTypes.PRIMARY}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
