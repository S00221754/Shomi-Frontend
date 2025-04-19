import React from "react";
import { View } from "react-native";
import { useTheme } from "@rneui/themed";

// This is used to create the frame for the camera
const CameraCorner = ({ position }: { position: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) => {
  const { theme } = useTheme();
  const size = 30;
  const thickness = 3;

  const cornerStyles = {
    position: "absolute" as const,
    width: size,
    height: size,
    borderColor: theme.colors.white,
    borderTopWidth: thickness,
    borderLeftWidth: thickness,
    transform: [],
  };

  switch (position) {
    case "top-left":
      return <View style={{ ...cornerStyles, top: 0, left: 0 }} />;
    case "top-right":
      return <View style={{ ...cornerStyles, top: 0, right: 0, transform: [{ rotateY: "180deg" }] }} />;
    case "bottom-left":
      return <View style={{ ...cornerStyles, bottom: 0, left: 0, transform: [{ rotateX: "180deg" }] }} />;
    case "bottom-right":
      return <View style={{ ...cornerStyles, bottom: 0, right: 0, transform: [{ rotate: "180deg" }] }} />;
  }
};

export default CameraCorner;
