import { ProductInfo } from '@/types/ingredient';
import { Modal, View, Text, Button, StyleSheet, TextInput } from 'react-native';
import { addIngredient } from '@/services/ingredientsService';
import { useState } from 'react';

interface IngredientModalProps {
    visible: boolean;
    onClose: () => void;
    ingredient: ProductInfo | null;
    onAddIngredient: (ingredient: ProductInfo, unitInput: string) => Promise<void>;
}

const IngredientModal: React.FC<IngredientModalProps> = ({ visible, onClose, ingredient, onAddIngredient }) => {
    const [unitInput, setUnitInput] = useState("");

    if (!ingredient) return null;

    const handleAddClick = async () => {
        if (!unitInput) return;

        await onAddIngredient(ingredient, unitInput);
    };

    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Ingredient Details</Text>
                    <Text style={styles.modalText}>{ingredient.Ing_name}</Text>
                    <Text style={styles.modalText}>{ingredient.Ing_brand}</Text>
                    <TextInput style={styles.input} placeholder="Enter unit" value={unitInput} onChangeText={setUnitInput} />
                    <Button title="Close" onPress={onClose} />
                    <Button title="Add" onPress={handleAddClick} />
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
    input: {
        height: 40,
        width: "100%",
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
});

export default IngredientModal;