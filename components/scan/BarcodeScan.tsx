import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { CameraView } from "expo-camera";
import { ProductInfo } from "@/Interfaces/ingredient";
import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";

type BarcodeScanProps = {
  onStopScanning: () => void;
  onBarcodeScanned: (productInfo: ProductInfo) => void;
};
// This component is used to scan barcodes using the camera. It requests permission to use the camera and handles the scanning process. If the permission is granted, it displays the camera view and allows the user to scan barcodes. If the permission is denied, it shows a message asking for permission.
export default function BarcodeScan({
  onStopScanning,
  onBarcodeScanned,
}: BarcodeScanProps) {
  const { permission, requestPermission, scanned, handleBarCodeScanned } =
    useBarcodeScanner(onBarcodeScanned, onStopScanning);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: [
            "code39",
            "code93",
            "code128",
            "ean13",
            "ean8",
            "upc_a",
            "upc_e",
          ],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <Button title="Stop Scanning" onPress={onStopScanning} />
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  message: {
    fontSize: 18,
    textAlign: "center",
    margin: 20,
  },
});
