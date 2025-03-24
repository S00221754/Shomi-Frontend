import Toast, { ToastOptions } from 'react-native-toast-message';
import { TextStyle } from 'react-native';

type CustomToastType = 'success' | 'error' | 'info';

// Default text styles
const defaultText1Style: TextStyle = {
  fontWeight: "bold",
  fontSize: 16,
};

const defaultText2Style: TextStyle = {
  fontSize: 14,
  color: "#666",
};

export const showToast = (
  type: CustomToastType,
  title: string,
  message?: string,
  options: Partial<ToastOptions> = {}
) => {
  Toast.show({
    type,
    text1: title,
    text2: message,
    position: 'bottom',
    autoHide: true,
    visibilityTime: 2000,
    swipeable: true,
    bottomOffset: 40,
    text1Style: defaultText1Style,
    text2Style: defaultText2Style,
    ...options,
  });
};
