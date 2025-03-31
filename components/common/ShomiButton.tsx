import React from "react";
import { Button, Icon, useTheme } from "@rneui/themed";
import { ViewStyle, TextStyle } from "react-native";

interface ShomiButtonProps {
  title: string;
  onPress: () => void;
  icon?: string;
  color?: string;
  loading?: boolean;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  buttonStyle?: ViewStyle;
  titleStyle?: TextStyle;
}

const ShomiButton: React.FC<ShomiButtonProps> = ({
  title,
  onPress,
  icon,
  color,
  loading = false,
  disabled = false,
  containerStyle,
  buttonStyle,
  titleStyle,
}) => {

  const {theme} = useTheme();

  return (
    <Button
      title={title}
      icon={
        icon
          ? {
              name: icon,
              type: "material-community",
              color: "white",
              size: 24,
            }
          : undefined
      }
      iconPosition="left"
      onPress={onPress}
      loading={loading}
      disabled={disabled}
      containerStyle={containerStyle}
      buttonStyle={{
        backgroundColor: color || theme.colors.primary,
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        ...buttonStyle,
      }}
      titleStyle={{
        fontSize: 16,
        fontWeight: "600",
        marginLeft: icon ? 8 : 0,
        color: "white",
        ...titleStyle,
      }}
    />
  );
};

export default ShomiButton;
