import React from "react";
import { View, StyleSheet, ViewStyle, useColorScheme } from "react-native";
import LightLogo from "@/assets/images/shomi-light-logo.svg";
import DarkLogo from "@/assets/images/shomi-dark-logo.svg";
import { useTheme } from "@rneui/themed";

interface LogoProps {
  width?: number;
  height?: number;
  style?: ViewStyle;
}

const Logo: React.FC<LogoProps> = ({ width = 40, height = 40, style }) => {
  const { theme } = useTheme();
  const isDark = theme.mode === "dark";

  const LogoComponent = isDark ? DarkLogo : LightLogo;

  return (
    <View style={[styles.container, style]}>
      <LogoComponent width={width} height={height} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Logo;
