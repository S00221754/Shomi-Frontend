// components/Logo.tsx
import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import LightLogo from "@/assets/images/shomi-light-logo.svg";

// This component helps to dispaly the logo around the app whatever size.
interface LogoProps {
  width?: number;
  height?: number;
  style?: ViewStyle;
}

const Logo: React.FC<LogoProps> = ({ width = 40, height = 40, style }) => {
  return (
    <View style={[styles.container, style]}>
      <LightLogo width={width} height={height} />
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
