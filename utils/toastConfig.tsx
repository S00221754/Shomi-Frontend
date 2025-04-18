// utils/toastConfig.tsx
import type { ToastConfig } from "react-native-toast-message";
import ShomiToast from "@/components/toast/ShomiToast";

export const toastConfig: ToastConfig = {
  success: (props) => <ShomiToast {...props} />,
  error: (props) => <ShomiToast {...props} />,
  info: (props) => <ShomiToast {...props} />,
};
