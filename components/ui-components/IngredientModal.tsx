import { useGetIngredient } from '@/hooks/useGetIngredient';
import { ProductInfo } from '@/types/ingredient';
import React, { useState } from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

interface IngredientModalProps {
    visible: boolean;
    onClose: () => void;
    ingredient?: ProductInfo;
}

const IngredientModal: React.FC<IngredientModalProps> = ({ visible, onClose, ingredient }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>{ingredient?.ING_Name}</Text>
                    <Text style={styles.modalText}>{ingredient?.ING_BrandName}</Text>
                    <Button title="Close" onPress={onClose} />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});

export default IngredientModal;