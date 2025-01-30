import React, { useState } from 'react';
import { View, Button, StyleSheet, Modal, Text } from 'react-native';
import BarcodeScan from '../../components/functionality-components/BarcodeScan';
import ReceiptScan from '../../components/functionality-components/ReceiptScan';

interface ProductInfo {
    product_name: string;
    brands: string;
    //keywords: string[]; may use for search 
    // possible add nutrition facts with nutriments object
    // image url for product image
    status: boolean;
  }

  enum ScanningMode {
    Barcode = 'barcode',
    Receipt = 'receipt',
    None = 'none',
}

export default function ScannerScreen() {
    //states
    const [scanningMode, setScanningMode] = useState<ScanningMode>(ScanningMode.None);
    const [isScanning, setIsScanning] = useState(false);
    const [scannedData, setScannedData] = useState<ProductInfo| null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);


    // handle methods
    const handleScanProduct = () => {
        setScanningMode(ScanningMode.Barcode);
    };

    const handleScanReceipt = () => {
        setScanningMode(ScanningMode.Receipt);
    };

    const handleStopScanning = () => {
        setScanningMode(ScanningMode.None);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const handleBarcodeScanned = (productInfo : ProductInfo) => {
        setScannedData(productInfo);
        setIsModalVisible(true);
        setIsScanning(false);
    };

    // render
    return (
        <View style={styles.container}>
            {scanningMode === ScanningMode.None && (
                <View style={styles.buttonContainer}>
                    <Button
                        title="Scan Barcode"
                        onPress={handleScanProduct}
                    />
                    <Text style={styles.orText}>OR</Text>
                    <Button
                        title="Scan Receipt"
                        onPress={handleScanReceipt}
                    />
                </View>
            )}

            {scanningMode === ScanningMode.Barcode && (
                <BarcodeScan
                    onStopScanning={handleStopScanning}
                    onBarcodeScanned={handleBarcodeScanned}
                />
            )}

            {scanningMode === ScanningMode.Receipt && (
                <ReceiptScan onStopScanning={handleStopScanning}/>
            )}

            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Scanned Barcode</Text>
                        <Text style={styles.modalText}>Name: {scannedData?.product_name}</Text>
                        <Text style={styles.modalText}>Brand: {scannedData?.brands}</Text>
                        <Button title="Close" onPress={closeModal} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: '#25292e',
        justifyContent: 'center',
        alignItems: 'center',
    },
    orText: {
        marginVertical: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    receiptScannerPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: '#FFF',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
    },
});