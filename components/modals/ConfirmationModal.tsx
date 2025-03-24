import React from "react";
import { View } from "react-native";
import { Overlay, Button, Text } from "@rneui/themed";
import { useTheme } from "@rneui/themed";

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ visible, onClose, onConfirm, message }) => {
  const { theme } = useTheme();

  return (
    <Overlay
      isVisible={visible}
      onBackdropPress={onClose}
      overlayStyle={{
        width: "85%",
        backgroundColor: theme.colors.background,
        padding: 20,
        borderRadius: 10,
      }}
    >
      <Text h4 style={{ color: theme.colors.primary, textAlign: "center", marginBottom: 10 }}>
        Are you sure?
      </Text>
      <Text style={{ color: theme.colors.black, textAlign: "center", marginBottom: 20 }}>
        {message || "Are you sure you want to remove this item?"}
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Button
          title="Cancel"
          onPress={onClose}
          buttonStyle={{
            backgroundColor: theme.colors.grey3,
            borderRadius: 10,
            paddingVertical: 10,
            paddingHorizontal: 15,
          }}
          titleStyle={{ color: theme.colors.white, fontWeight: "bold" }}
        />
        <Button
          title="Remove"
          onPress={onConfirm}
          buttonStyle={{
            backgroundColor: theme.colors.error,
            borderRadius: 10,
            paddingVertical: 10,
            paddingHorizontal: 15,
          }}
          titleStyle={{ color: theme.colors.white, fontWeight: "bold" }}
        />
      </View>
    </Overlay>
  );
};

export default ConfirmationModal;
