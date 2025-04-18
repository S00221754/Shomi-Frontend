import dayjs from "dayjs";

export const isExpired = (dateString?: string | null): boolean => {
  if (!dateString) return false;
  return dayjs(dateString).isBefore(dayjs(), "day");
};

export const isExpiringSoon = (dateString?: string | null): boolean => {
  if (!dateString) return false;
  const today = dayjs();
  const expiry = dayjs(dateString);
  const diffInDays = expiry.diff(today, "day");
  return diffInDays >= 0 && diffInDays <= 3;
};
