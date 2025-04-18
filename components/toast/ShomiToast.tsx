import React from "react";
import { View, Dimensions } from "react-native";
import { Text, useTheme } from "@rneui/themed";
import { BaseToastProps } from "react-native-toast-message";

interface ShomiToastProps extends BaseToastProps {
  props: {
    isDark?: boolean;
    toastType?: "success" | "error" | "info";
  };
}

const ShomiToast: React.FC<ShomiToastProps> = ({ text1, text2, props }) => {
  const { theme } = useTheme();
  const isDark = props?.isDark ?? theme.mode === "dark";
  const type = props?.toastType ?? "success";

  const screenWidth = Dimensions.get("window").width;
  const toastWidth = Math.min(screenWidth * 0.85, 360);

  const backgroundColors: Record<string, string> = {
    success: theme.colors.secondary,
    error: isDark ? "#3a1e1e" : "#fee2e2",
    info: isDark ? "#1e293b" : "#e0f2fe",
  };

  const borderColors: Record<string, string> = {
    success: theme.colors.success,
    error: theme.colors.error,
    info: "#3b82f6",
  };

  return (
    <View
      style={{
        backgroundColor: backgroundColors[type],
        borderLeftColor: borderColors[type],
        borderLeftWidth: 5,
        borderRadius: 20,
        paddingVertical: 14,
        paddingHorizontal: 20,
        width: toastWidth,
        alignSelf: "center",
        shadowColor: theme.colors.greyOutline,
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 5,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          letterSpacing: 0.3,
          color: theme.colors.white,
          marginBottom: text2 ? 4 : 0,
        }}
      >
        {text1}
      </Text>

      {text2 && (
        <Text
          style={{
            fontSize: 16,
            fontWeight: "400",
            lineHeight: 18,
            color: theme.colors.white,
          }}
        >
          {text2}
        </Text>
      )}
    </View>
  );
};

export default ShomiToast;
