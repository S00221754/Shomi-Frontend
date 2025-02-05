import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import axios from 'axios';
import { ProductInfo } from '@/types/ingredient';
import { getIngredientByBarcode } from '@/services/ingredientsService';

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
            console.log('Barcode scanned:', data);
            
            const dbResponse = await getIngredientByBarcode(data);
            console.log('database response', dbResponse);
            
            if (dbResponse){
                const productInfo: ProductInfo = {
                    Ing_id: dbResponse.Ing_id,
                    Ing_barcode: dbResponse.Ing_barcode,
                    Ing_name: dbResponse.Ing_name,
                    Ing_brand: dbResponse.Ing_brand,
                    Ing_keywords: dbResponse.Ing_keywords,
                    Ing_units: dbResponse.Ing_units,
                    status: true,
                    In_Database: true,
                };
                onBarcodeScanned(productInfo);
                return;
            }

            const apiUrl = `https://world.openfoodfacts.org/api/v0/product/${data}.json`;
    
            const response = await axios.get(apiUrl);
    
            if (response.data.status === 1) {
                const productInfo: ProductInfo = {
                    Ing_barcode: data || 'Unknown', // need to check this
                    Ing_name: response.data.product.product_name || 'Unknown',
                    Ing_brand: response.data.product.brands || 'Unknown',
                    Ing_keywords: response.data.product._keywords || ['Unknown'],
                    Ing_units:[],
                    status: true,
                    In_Database: false,
                };
                onBarcodeScanned(productInfo);
            } else {
                const productInfo: ProductInfo = {
                    Ing_name: 'Product not found',
                    Ing_barcode: 'Product not found',
                    Ing_brand: 'Product not found',
                    status: false,
                    In_Database: false,
                };
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
                Ing_name: 'Product not found',
                Ing_barcode: 'Product not found',
                Ing_brand: 'Product not found',
                status: false,
                In_Database: false,
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