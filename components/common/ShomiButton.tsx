import React from "react";
import { Button, Icon, useTheme } from "@rneui/themed";
import { ViewStyle, TextStyle } from "react-native";

// shomi button component to be used in the app
// this is a custom button component that uses the rne button component and adds some custom styles to it that adheres to material UI
interface ShomiButtonProps {
  title?: string;
  onPress: () => void;
  type?: "solid" | "outline" | "clear";
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
  type = "solid",
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
      type={type}
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
        backgroundColor: type === "outline" ? "transparent" : color || theme.colors.primary,
        borderColor: type === "outline" ? color || theme.colors.primary : "transparent",
        borderWidth: type === "outline" ? 1.5 : 0,
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
        color: type === "outline" ? color || theme.colors.primary : "white",
        marginLeft: icon && !isIconOnly ? 8 : 0,
        ...titleStyle,
      }}
    />
  );
};

export default ShomiButton;
