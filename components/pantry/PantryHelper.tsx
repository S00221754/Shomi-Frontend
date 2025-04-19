import { Badge, useTheme } from "@rneui/themed";
import dayjs from "dayjs";
import { ExpiryStatus, QuantityStatus } from "@/Interfaces/ingredient";

export const getExpiryStatus = (expiryDate: string): ExpiryStatus => {
  const today = dayjs();
  const expiry = dayjs(expiryDate);

  if (expiry.isBefore(today, "day")) return ExpiryStatus.Expired;
  if (expiry.diff(today, "day") <= 3) return ExpiryStatus.Soon;
  return ExpiryStatus.Fresh;
};

export const renderExpiryBadge = (expiryDate: string) => {
  const { theme } = useTheme();
  const status = getExpiryStatus(expiryDate);
  const ingredientStatus = {
    [ExpiryStatus.Expired]: "error",
    [ExpiryStatus.Soon]: "warning",
    [ExpiryStatus.Fresh]: "primary",
  } as const;

  return (
    <Badge
      value={status}
      status={ingredientStatus[status]}
      containerStyle={{ marginLeft: 6 }}
      badgeStyle={{ borderWidth: 0, elevation: 0 }}
    />
  );
};

export const getQuantityStatus = (
  totalAmountStr: string,
  baseAmount: number
): QuantityStatus => {
  const totalAmount = parseFloat(totalAmountStr);

  if (isNaN(totalAmount)) return QuantityStatus.OutOfStock;

  if (totalAmount <= 0) return QuantityStatus.OutOfStock;
  if (totalAmount < baseAmount * 0.25) return QuantityStatus.Low;
  return QuantityStatus.InStock;
};

export const renderQuantityBadge = (
  totalAmount: string,
  baseAmount: number
) => {
  const { theme } = useTheme();
  const status = getQuantityStatus(totalAmount, baseAmount);
  const quantityColor = {
    [QuantityStatus.OutOfStock]: "error",
    [QuantityStatus.Low]: "warning",
    [QuantityStatus.InStock]: "primary",
  } as const;

  return (
    <Badge
      value={status}
      status={quantityColor[status]}
      containerStyle={{ marginLeft: 6 }}
      badgeStyle={{ borderWidth: 0, elevation: 0 }}
    />
  );
};
