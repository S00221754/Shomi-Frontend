import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

// This function is used to get the Expo push token for the device. It checks for existing permissions, requests them if not granted, and then retrieves the token.
export async function getExpoPushToken(): Promise<string | null> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") return null;

  try {
    const tokenResponse = await Notifications.getExpoPushTokenAsync();
    const token = tokenResponse.data;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    return token;
  } catch (error) {
    console.error("Error while getting Expo push token:", error);
    return null;
  }
}
