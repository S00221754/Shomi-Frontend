import React, { useState } from 'react';
import { View, Button, StyleSheet, Modal, Text } from 'react-native';
import BarcodeScan from '../../components/functionality-components/BarcodeScan';

interface ProductInfo {
    product_name: string;
    brands: string;
    //keywords: string[]; may use for search 
    // possible add nutrition facts with nutriments object
    // image url for product image
    status: boolean;
  }


export default function ScannerScreen() {
    const [isScanning, setIsScanning] = useState(false);
    const [scannedData, setScannedData] = useState<ProductInfo| null>(null); // State to hold scanned data
    const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility

    const handleScanProduct = () => {
        setIsScanning(true);
    };

    const handleStopScanning = () => {
        setIsScanning(false);
    };

    const closeModal = () => {
        setIsModalVisible(false); // Hide the modal
    };

    const handleBarcodeScanned = (productInfo : ProductInfo) => {
        setScannedData(productInfo); // Update scanned data
        setIsModalVisible(true); // Show the modal
        setIsScanning(false); // Stop scanning
    };

    return (
        <View style={styles.container}>
            {!isScanning && (
                <View style={styles.buttonContainer}>
                    <Button
                        title="Scan Product"
                        onPress={handleScanProduct}
                    />
                </View>
            )}

            {isScanning && (
                <BarcodeScan
                    onStopScanning={handleStopScanning}
                    onBarcodeScanned={handleBarcodeScanned} // Pass the callback
                />
            )}

            {/* Modal to display scanned data */}
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
    },
    buttonContainer: {
        margin: 20,
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