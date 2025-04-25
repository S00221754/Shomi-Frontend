import type { ToastConfig } from "react-native-toast-message";
import ShomiToast from "@/components/toast/ShomiToast";


// toast configuration for react-native-toast-message to match app theme
export const toastConfig: ToastConfig = {
  success: (props) => <ShomiToast {...props} />,
  error: (props) => <ShomiToast {...props} />,
  info: (props) => <ShomiToast {...props} />,
};
