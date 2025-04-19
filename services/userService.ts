import axiosInstance from "./api";

export async function updateExpoPushToken(userId: string, expoPushToken: string) {
  return axiosInstance.patch(`/profile/${userId}`, {
    expo_push_token: expoPushToken,
  });
}
