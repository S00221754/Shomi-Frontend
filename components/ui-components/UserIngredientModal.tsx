import React, { useState } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
} from "react-native";
import { ProductInfo } from "@/types/ingredient";
import { UserIngredientInput } from "@/types/user-ingredient";

interface UserIngredientModalProps {
    visible: boolean;
    onClose: () => void;
    userIngredient: UserIngredientInput | null;
    onAddUserIngredient: (
        userIngredient: UserIngredientInput
    ) => void;
}

const UserIngredientModal: React.FC<UserIngredientModalProps> = ({
    visible,
    onClose,
    userIngredient,
    onAddUserIngredient
}) => {
    const [unitQuantity, setUnitQuantity] = useState("");
    const [totalAmount, setTotalAmount] = useState("");
    const [unitType, setUnitType] = useState("");
    const [expiryDate, setExpiryDate] = useState("");

    if (!userIngredient) return null;

    const handleAddClick = async () => {
        await onAddUserIngredient(
            userIngredient
        );
    };
    
    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Add to Pantry</Text>
                    <Text style={styles.modalText}>ingredientID: {userIngredient.ingredientId}</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Enter Quantity"
                        keyboardType="numeric"
                        value={unitQuantity}
                        onChangeText={setUnitQuantity}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Enter Total Amount"
                        keyboardType="numeric"
                        value={totalAmount}
                        onChangeText={setTotalAmount}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Enter Unit Type (e.g., ml, g)"
                        value={unitType}
                        onChangeText={setUnitType}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Enter Expiry Date (YYYY-MM-DD)"
                        value={expiryDate}
                        onChangeText={setExpiryDate}
                    />

                    <Button title="Add to Pantry" onPress={handleAddClick} />
                    <Button title="Close" onPress={onClose} />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
    },
    input: {
        width: "100%",
        padding: 8,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "gray",
    },
});

export default UserIngredientModal;
