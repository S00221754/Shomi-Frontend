import React from "react";
import { View, Text, Button } from "react-native";
import { CameraView } from "expo-camera";
import { ProductInfo } from "@/Interfaces/ingredient";
import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";
import ShomiButton from "../common/ShomiButton";
import { useTheme } from "@rneui/themed";
import CameraCorner from "../camera/CameraCorners";

// This component is used to scan barcodes using the device's camera. It handles permission requests and displays a camera view with scanning functionality.
export default function BarcodeScan({
  onStopScanning,
  onBarcodeScanned,
}: {
  onStopScanning: () => void;
  onBarcodeScanned: (productInfo: ProductInfo) => void;
}) {
  const { permission, requestPermission, scanned, handleBarCodeScanned } = useBarcodeScanner(
    onBarcodeScanned,
    onStopScanning
  );

  const { theme } = useTheme();
  const isDark = theme.mode === "dark";
  const textColor = isDark ? theme.colors.white : theme.colors.black;
  const backgroundColor = theme.colors.background;

  if (!permission) return <View style={{ flex: 1, backgroundColor }} />;

  if (!permission.granted) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            textAlign: "center",
            marginBottom: 20,
            color: textColor,
          }}
        >
          We need your permission to use the camera.
        </Text>
        <ShomiButton onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["code39", "code93", "code128", "ean13", "ean8", "upc_a", "upc_e"],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 250,
              height: 250,
              position: "relative",
            }}
          >
            <CameraCorner position="top-left" />
            <CameraCorner position="top-right" />
            <CameraCorner position="bottom-left" />
            <CameraCorner position="bottom-right" />
          </View>
        </View>

        <View
          style={{
            position: "absolute",
            bottom: 40,
            width: "100%",
            alignItems: "center",
          }}
        >
          <Button title="Stop Scanning" onPress={onStopScanning} color={theme.colors.error} />
        </View>
      </CameraView>
    </View>
  );
}
