import React, { useState } from 'react';
import { View, Button, StyleSheet, Modal, Text } from 'react-native';
import BarcodeScan from '../../components/functionality-components/BarcodeScan';
import ReceiptScan from '../../components/functionality-components/ReceiptScan';
import { ProductInfo } from '@/types/ingredient';
import IngredientModal from '@/components/ui-components/IngredientModal';
import { useIngredientScanner } from '@/hooks/useIngredientScanner';

  enum ScanningMode {
    Barcode = 'barcode',
    Receipt = 'receipt',
    None = 'none',
}

export default function ScannerScreen() {
    const {
        scanningMode,
        scannedData,
        isModalVisible,
        handleScanProduct,
        handleStopScanning,
        closeModal,
        handleBarcodeScanned,
        handleAddIngredient,
    } = useIngredientScanner();

    return (
        <View style={styles.container}>
            {scanningMode === "None" && (
                <View style={styles.buttonContainer}>
                    <Button title="Scan Barcode" onPress={handleScanProduct} />
                    <Text style={styles.orText}>OR</Text>
                    <Button title="Scan Receipt" disabled={true} />
                    <Text style={styles.orText}>Receipt scan is disabled for now</Text>
                </View>
            )}

            {scanningMode === "Barcode" && (
                <BarcodeScan onStopScanning={handleStopScanning} onBarcodeScanned={handleBarcodeScanned} />
            )}

            {scanningMode === "Receipt" && <ReceiptScan onStopScanning={handleStopScanning} />}

            <IngredientModal 
                visible={isModalVisible} 
                onClose={closeModal} 
                ingredient={scannedData as ProductInfo} 
                onAddIngredient={handleAddIngredient} />
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