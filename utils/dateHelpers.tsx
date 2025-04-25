import dayjs from "dayjs";

// Function to format a date string to "YYYY-MM-DD" format
export const isExpired = (dateString?: string | null): boolean => {
  if (!dateString) return false;
  return dayjs(dateString).isBefore(dayjs(), "day");
};

// Function to check if a date is expiring soon (within 3 days)
export const isExpiringSoon = (dateString?: string | null): boolean => {
  if (!dateString) return false;
  const today = dayjs();
  const expiry = dayjs(dateString);
  const diffInDays = expiry.diff(today, "day");
  return diffInDays >= 0 && diffInDays <= 3;
};
