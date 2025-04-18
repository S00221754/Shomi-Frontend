// useToast.ts
import { useTheme } from "@rneui/themed";
import Toast, { ToastOptions } from "react-native-toast-message";
import { TextStyle, ViewStyle } from "react-native";

type CustomToastType = "success" | "error" | "info";

export const useToast = () => {
  const { theme } = useTheme();
  const isDark = theme.mode === "dark";

  const showToast = (
    type: CustomToastType,
    title: string,
    message?: string,
    position: "bottom" | "top" = "top",
    options: Partial<ToastOptions> = {}
  ) => {
    Toast.show({
      type,
      text1: title,
      text2: message,
      position,
      autoHide: true,
      visibilityTime: 1500,
      swipeable: true,
      topOffset: 120,
      bottomOffset: 40,
      props: {
        isDark,
        toastType: type,
      },
      ...options,
    });
  };

  return { showToast };
};
