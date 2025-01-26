import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';

interface ProductInfo {
    product_name: string;
    brands: string;
    //keywords: string[]; may use for search 
    // possible add nutrition facts with nutriments object
    // image url for product image
  }

type BarcodeScanProps = {
    onStopScanning: () => void;
    onBarcodeScanned: (data: string, type: string) => void; //change to product info later
};

export default function BarcodeScan({ onStopScanning, onBarcodeScanned }: BarcodeScanProps) {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const facing = 'back';

    useEffect(() => {
        (async () => {
            const { status } = await requestPermission();
            console.log('Camera permission status:', status);
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
        setScanned(true);
        onBarcodeScanned(data, type);
        onStopScanning();
    };

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing={facing}
                barcodeScannerSettings={{
                    barcodeTypes: [
                        'aztec',
                        'codabar',
                        'code39',
                        'code93',
                        'code128',
                        'datamatrix',
                        'ean13',
                        'ean8',
                        'itf14',
                        'pdf417',
                        'upc_a',
                        'upc_e',
                        'qr',
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
        flex: 1, // Ensure the camera takes up the full screen
    },
    message: {
        fontSize: 18,
        textAlign: 'center',
        margin: 20,
    },
});