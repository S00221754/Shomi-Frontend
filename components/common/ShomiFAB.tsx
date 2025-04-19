import React from "react";
import { FAB } from "react-native-paper";
import { useTheme } from "@rneui/themed";

interface FABAction {
  icon: string;
  label: string;
  onPress: () => void;
}

interface ShomiFABProps {
  selectedItems?: any[];
  onDelete?: () => void;
  actions: FABAction[];
  fabOpen: boolean;
  setFabOpen: (open: boolean) => void;
  defaultIcon?: string;
  allowDelete?: boolean;
}

const ShomiFAB: React.FC<ShomiFABProps> = ({
  selectedItems = [],
  onDelete = () => {},
  actions,
  fabOpen,
  setFabOpen,
  defaultIcon = "menu",
  allowDelete = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme.mode === "dark";
  const isDeleteMode = allowDelete && selectedItems.length > 0;

  return (
    <FAB.Group
      open={fabOpen}
      visible={true}
      icon={isDeleteMode ? "delete" : fabOpen ? "close" : defaultIcon}
      color={theme.colors.white}
      fabStyle={{
        backgroundColor: isDeleteMode ? theme.colors.error : theme.colors.primary,
      }}
      backdropColor="rgba(0,0,0,0.5)"
      actions={
        isDeleteMode
          ? []
          : actions.map((action) => ({
              ...action,
              color: theme.colors.white,
              style: {
                backgroundColor: theme.colors.secondary,
              },
              labelStyle: {
                backgroundColor: theme.colors.background,
                color: isDark ? theme.colors.white : theme.colors.black,
                fontSize: 14,
                fontWeight: "600",
                borderRadius: 6,
                paddingHorizontal: 10,
                paddingVertical: 4,
              },
            }))
      }
      onPress={() => {
        if (isDeleteMode) {
          onDelete();
        } else {
          setFabOpen(!fabOpen);
        }
      }}
      onStateChange={({ open }) => setFabOpen(open)}
    />
  );
};

export default ShomiFAB;
