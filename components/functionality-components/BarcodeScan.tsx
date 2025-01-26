import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import axios from 'axios';

interface ProductInfo {
    product_name: string;
    brands: string;
    //keywords: string[]; may use for search 
    // possible add nutrition facts with nutriments object
    // image url for product image
    status: boolean;
  }

type BarcodeScanProps = {
    onStopScanning: () => void;
    onBarcodeScanned: (productInfo : ProductInfo) => void; //change to product info later
};

export default function BarcodeScan({ onStopScanning, onBarcodeScanned }: BarcodeScanProps) {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const facing = 'back';

    const handleBarCodeScanned = async ({ data }: BarcodeScanningResult) => {
        try {
            setScanned(true);

            const apiUrl = `https://world.openfoodfacts.org/api/v0/product/${data}.json`;
    
            const response = await axios.get(apiUrl);
    
            if (response.data.status === 1) {
                const productInfo: ProductInfo = {
                    product_name: response.data.product.product_name || 'Unknown',
                    brands: response.data.product.brands || 'Unknown',
                    status: true,
                };
                onBarcodeScanned(productInfo);
            } else {
                const productInfo: ProductInfo = {
                    product_name: 'Product not found',
                    brands: 'Product not found',
                    status: false,
                };
    
                console.log('Product Info:', productInfo);
                onBarcodeScanned(productInfo);
            }
        } catch (error) {
            //remove this later when finisehd debugging
            if (axios.isAxiosError(error)) {
                console.error('Axios Error:', error.message);
                if (error.response) {
                    console.error('API Response Error:', error.response.data);
                } else if (error.request) {
                    console.error('No response received from the API');
                } else {
                    console.error('Axios Request Error:', error.message);
                }
            } else {
                console.error('Unexpected Error:', error);
            }

            const productInfo: ProductInfo = {
                product_name: 'Error scanning barcode',
                brands: 'Error scanning barcode',
                status: false,
            };

            onBarcodeScanned(productInfo);
        } finally {
            onStopScanning();
        }
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
                        'code39',
                        'code93',
                        'code128',
                        'ean13',
                        'ean8',
                        'upc_a',
                        'upc_e',
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
        textAlign: 'center',
        margin: 20,
    },
});