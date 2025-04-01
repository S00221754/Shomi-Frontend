import React from "react";
import { FAB } from "react-native-paper";
import { useTheme } from "@rneui/themed";

interface FABAction {
  icon: string;
  label: string;
  onPress: () => void;
}

interface ShomiFABProps {
  selectedItems?: any[]; // now optional
  onDelete?: () => void; // optional if allowDelete = false
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

  const isDeleteMode = allowDelete && selectedItems.length > 0;

  return (
    <FAB.Group
      open={fabOpen}
      visible={true}
      icon={isDeleteMode ? "delete" : fabOpen ? "close" : defaultIcon}
      color={theme.colors.white}
      fabStyle={{
        backgroundColor: isDeleteMode
          ? theme.colors.error
          : theme.colors.primary,
      }}
      backdropColor="rgba(0,0,0,0.5)"
      actions={
        isDeleteMode
          ? []
          : actions.map((action) => ({
              ...action,
              labelStyle: {
                backgroundColor: theme.colors.grey4,
                color: theme.colors.black,
                fontSize: 16,
                fontWeight: "bold",
                paddingVertical: 6,
                paddingHorizontal: 10,
                borderRadius: 6,
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
