import React from "react";
import { Button, Icon, useTheme } from "@rneui/themed";
import { ViewStyle, TextStyle } from "react-native";

interface ShomiButtonProps {
  title?: string;
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
  title = "",
  onPress,
  icon,
  color,
  loading = false,
  disabled = false,
  containerStyle,
  buttonStyle,
  titleStyle,
}) => {
  const { theme } = useTheme();
  const isIconOnly = !title?.trim();

  return (
    <Button
      title={title}
      icon={
        icon
          ? {
              name: icon,
              type: "material-community",
              color: "white",
              size: 22,
            }
          : undefined
      }
      iconPosition="left"
      onPress={onPress}
      loading={loading}
      disabled={disabled}
      containerStyle={[isIconOnly && { width: 40, height: 40 }, containerStyle]}
      buttonStyle={{
        backgroundColor: color || theme.colors.primary,
        borderRadius: isIconOnly ? 20 : 12,
        width: isIconOnly ? 40 : undefined,
        height: isIconOnly ? 40 : undefined,
        paddingVertical: isIconOnly ? 0 : 12,
        paddingHorizontal: isIconOnly ? 0 : 16,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        ...buttonStyle,
      }}
      titleStyle={{
        fontSize: 16,
        fontWeight: "600",
        color: "white",
        marginLeft: icon && !isIconOnly ? 8 : 0,
        ...titleStyle,
      }}
    />
  );
};

export default ShomiButton;
