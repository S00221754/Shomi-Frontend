import { ProductInfo } from '@/types/ingredient';
import { Modal, View, Text, Button, StyleSheet, TextInput } from 'react-native';
import { addIngredient } from '@/services/ingredientsService';
import { useState } from 'react';

interface IngredientModalProps {
    visible: boolean;
    onClose: () => void;
    ingredient: ProductInfo;
}

const IngredientModal: React.FC<IngredientModalProps> = ({ visible, onClose, ingredient }) => {
    const [unitInput, setUnitInput] = useState("");
    const handleAdd = async () => {
        try {
            console.log(ingredient); 
            
            // remove later
            const updatedIngredient = {
                ...ingredient,
                ING_Units: unitInput ? [unitInput] : ingredient.ING_Units, 
            };

            console.log(updatedIngredient);
            
            await addIngredient(updatedIngredient);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                <Text style={styles.modalText}>Ingredient Details</Text>
                    <Text style={styles.modalText}>{ingredient?.ING_Name}</Text>
                    <Text style={styles.modalText}>{ingredient?.ING_BrandName}</Text>
                    <Text style={styles.modalText}>{ingredient?.ING_KeyWords}</Text>
                    <Text style={styles.modalText}>Enter Unit:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., kg"
                        value={unitInput}
                        onChangeText={setUnitInput}
                    />
                    <Button title="Close" onPress={onClose} />
                    <Button title="Add" onPress={handleAdd} />
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