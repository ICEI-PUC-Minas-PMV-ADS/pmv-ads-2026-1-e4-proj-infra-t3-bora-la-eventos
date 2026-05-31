import { FC } from "react";
import { ArrowLeft } from "lucide-react-native";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TSignInViewProps } from "./types";
import { SignInViewStyles } from "./sign-in.styles";
import { Input } from "~/components/input";
import { Button, EButtonTypes } from "~/components/button";
import { scale } from "~/util/scale";
import { theme } from "~/configs/theme";

export const SignInView: FC<TSignInViewProps> = ({
  handleGoBack,
  handleLogin,
  handleSubmit,
  handleUpdateConfirmPassword,
  handleUpdateDocument,
  handleUpdateEmail,
  handleUpdateName,
  handleUpdatePassword,
}) => {
  const insets = useSafeAreaInsets();
  const {
    button,
    callout,
    calloutAction,
    calloutText,
    content,
    form,
    header,
    headerButton,
    headerTitle,
    screen,
    subtitle,
    title,
    titleWrapper,
  } = SignInViewStyles;

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
            paddingTop: insets.top,
            paddingBottom: insets.bottom + theme.verticalSpaces.xxl,
          },
        ]}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={header}>
          <TouchableOpacity
            accessibilityLabel="Voltar"
            onPress={handleGoBack}
            style={headerButton}
          >
            <ArrowLeft color={theme.colors.textPrimary} size={scale(22)} />
          </TouchableOpacity>
          <Text style={headerTitle}>Criar Conta</Text>
          <View style={headerButton} />
        </View>

        <View style={titleWrapper}>
          <Text style={title}>Junte-se a nós</Text>
          <Text style={subtitle}>
            Preencha os dados abaixo para participar dos melhores eventos e
            conferências.
          </Text>
        </View>

        <View style={form}>
          <Input
            hasLabel
            label="Nome completo"
            inputProps={{
              autoCapitalize: "words",
              placeholder: "Ex: João Silva",
              onChangeText: handleUpdateName,
            }}
          />
          <Input
            hasLabel
            label="CPF"
            inputProps={{
              keyboardType: "number-pad",
              placeholder: "000.000.000",
              onChangeText: handleUpdateDocument,
            }}
          />
          <Input
            hasLabel
            label="E-mail"
            inputProps={{
              autoCapitalize: "none",
              keyboardType: "email-address",
              placeholder: "seuemail@exemplo.com",
              onChangeText: handleUpdateEmail,
            }}
          />
          <Input
            hasLabel
            isPassword
            label="Senha"
            inputProps={{
              placeholder: "Mínimo 8 caracteres",
              onChangeText: handleUpdatePassword,
            }}
          />
          <Input
            hasLabel
            isPassword
            label="Confirmar senha"
            inputProps={{
              placeholder: "Confirme sua senha",
              onChangeText: handleUpdateConfirmPassword,
            }}
          />
        </View>

        <Button
          label="Criar Conta"
          containerProps={{
            onPress: handleSubmit,
            style: button,
          }}
          type={EButtonTypes.PRIMARY}
        />

        <View style={callout}>
          <Text style={calloutText}>Já possui uma conta?</Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={calloutAction}>Entre aqui</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
