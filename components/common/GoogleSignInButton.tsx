import React from "react";
import { TouchableOpacity, View, useColorScheme } from "react-native";
import { SvgUri } from "react-native-svg";
import { Text, useTheme } from "@rneui/themed";

interface Props {
  onPress: () => void;
  title?: string;
}

const GoogleSignInButton: React.FC<Props> = ({
  onPress,
  title = "Sign in with Google",
}) => {
  const { theme } = useTheme();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: isDark ? theme.colors.black : theme.colors.white,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: isDark ? theme.colors.greyOutline : "#ccc",
        width: "100%",
        justifyContent: "center",
        shadowColor: isDark ? "#000" : "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      }}
    >
      <View style={{ marginRight: 12 }}>
        <SvgUri
          uri="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
          width={20}
          height={20}
        />
      </View>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "500",
          color: isDark ? theme.colors.white : theme.colors.black,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default GoogleSignInButton;
