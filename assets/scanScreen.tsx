import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import BarcodeScan from '../components/scan/BarcodeScan';
import IngredientModal from '@/components/modals/IngredientModal';
import UserIngredientModal from '@/components/modals/UserIngredientModal';
import { useScannerState } from '@/hooks/useScannerState';
import { useScannerLogic } from '@/hooks/useScannerLogic';

enum ScanningMode {
    Barcode = 'barcode',
    Receipt = 'receipt',
    None = 'none',
}

export default function ScannerScreen() {
    const {
        scanningMode,
        isAddIngredientModalVisible,
        isAddUserIngredientModalVisible,
        handleScanProduct,
        handleStopScanning,
        closeIngredientModal,
        closeUserIngredientModal,
        setIsAddIngredientModalVisible,
        setIsAddUserIngredientModalVisible,
    } = useScannerState();

    const {
        scannedData,
        userIngredient,
        handleBarcodeScanned,
        handleAddIngredient,
        handleAddUserIngredient,
    } = useScannerLogic(setIsAddIngredientModalVisible, setIsAddUserIngredientModalVisible);

    return (
        <View style={styles.container}>
            {scanningMode === "None" && (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.scanButton} onPress={handleScanProduct} activeOpacity={0.8}>
                        <Text style={styles.buttonText}>Scan Barcode</Text>
                    </TouchableOpacity>

                    <Text style={styles.orText}>OR</Text>

                    <TouchableOpacity style={styles.disabledButton} disabled>
                        <Text style={styles.disabledButtonText}>Scan Receipt</Text>
                    </TouchableOpacity>

                    <Text style={styles.orText}>Receipt scan is disabled for now</Text>
                </View>
            )}

            {scanningMode === "Barcode" && (
                <BarcodeScan onStopScanning={handleStopScanning} onBarcodeScanned={handleBarcodeScanned} />
            )}

            <UserIngredientModal
                visible={isAddUserIngredientModalVisible}
                onClose={closeUserIngredientModal}
                userIngredient={userIngredient}
                onAddUserIngredient={handleAddUserIngredient}
            />

            <IngredientModal
                visible={isAddIngredientModalVisible}
                onClose={closeIngredientModal}
                ingredient={scannedData}
                onAddIngredient={handleAddIngredient}
            />
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
        backgroundColor: "#25292e",
        justifyContent: "center",
        alignItems: "center",
      },
      scanButton: {
        backgroundColor: "#ffd33d", // Yellow button
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        width: 200, // Fixed width for consistency
        elevation: 3, // Shadow effect for Android
        shadowColor: "#000", // Shadow effect for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      disabledButton: {
        backgroundColor: "#555", // Dark gray for disabled button
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        width: 200,
        opacity: 0.5, // Slight transparency to indicate disabled state
      },
      buttonText: {
        color: "#25292e", // Dark text for contrast
        fontSize: 16,
        fontWeight: "bold",
      },
      disabledButtonText: {
        color: "#bbb", // Light gray text for disabled button
        fontSize: 16,
        fontWeight: "bold",
      },
      orText: {
        marginVertical: 10,
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
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