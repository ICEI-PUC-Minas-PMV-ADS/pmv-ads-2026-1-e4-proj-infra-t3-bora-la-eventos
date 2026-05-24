import { FC, useState } from "react";
import { Modal, TextInput, View, Text } from "react-native";

import { Button, EButtonTypes } from "~/components/button";
import { LocationModalStyles } from "./location-modal.styles";
import { TLocationModalProps } from "./types";

export const LocationModal: FC<TLocationModalProps> = ({
  visible,
  onConfirm,
  onClose,
}) => {
  const [cep, setCep] = useState("");
  const { overlay, container, title, description, input, actionsRow } =
    LocationModalStyles;

  const handleConfirm = () => {
    const cleaned = cep.replace(/\D/g, "");
    if (cleaned.length === 8) {
      onConfirm(cleaned);
      setCep("");
    }
  };

  const handleClose = () => {
    setCep("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={overlay}>
        <View style={container}>
          <Text style={title}>Sua localização</Text>
          <Text style={description}>
            Informe o CEP para encontrar eventos próximos a você.
          </Text>
          <TextInput
            style={input}
            placeholder="00000-000"
            placeholderTextColor="#CBD5E1"
            value={cep}
            onChangeText={setCep}
            keyboardType="numeric"
            maxLength={9}
          />
          <View style={actionsRow}>
            <Button
              label="Cancelar"
              type={EButtonTypes.PRIMARY_OUTLINE}
              containerProps={{ onPress: handleClose, style: { flex: 1 } }}
            />
            <Button
              label="Confirmar"
              type={EButtonTypes.PRIMARY}
              containerProps={{ onPress: handleConfirm, style: { flex: 1 } }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
