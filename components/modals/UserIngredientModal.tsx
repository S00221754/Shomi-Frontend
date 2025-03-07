import React, { useState } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    TouchableOpacity,
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
    onAddUserIngredient,
}) => {
    const [unitQuantity, setUnitQuantity] = useState("");
    const [totalAmount, setTotalAmount] = useState("");
    const [unitType, setUnitType] = useState("");
    const [expiryDate, setExpiryDate] = useState("");

    if (!userIngredient) return null;

    const handleAddClick = async () => {

        userIngredient.unitQuantity = parseFloat(unitQuantity);
        userIngredient.totalAmount = parseFloat(totalAmount);
        userIngredient.unitType = unitType;
        
        await onAddUserIngredient(userIngredient);
    };

    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Add to Pantry</Text>
                    <Text style={styles.subText}>Ingredient ID: {userIngredient.ingredientId}</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Enter Quantity"
                        placeholderTextColor="#bbb"
                        keyboardType="numeric"
                        value={unitQuantity}
                        onChangeText={setUnitQuantity}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Enter Total Amount"
                        placeholderTextColor="#bbb"
                        keyboardType="numeric"
                        value={totalAmount}
                        onChangeText={setTotalAmount}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Enter Unit Type (e.g., ml, g)"
                        placeholderTextColor="#bbb"
                        value={unitType}
                        onChangeText={setUnitType}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Enter Expiry Date (YYYY-MM-DD)"
                        placeholderTextColor="#bbb"
                        value={expiryDate}
                        onChangeText={setExpiryDate}
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.addButton, {marginLeft: 5}]} onPress={handleAddClick}>
                            <Text style={styles.buttonText}>Add to Pantry</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: "#333",
        width: "85%",
        padding: 20,
        borderRadius: 12,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#ffd33d",
        marginBottom: 10,
    },
    subText: {
        fontSize: 14,
        color: "#ccc",
        marginBottom: 15,
    },
    input: {
        width: "100%",
        backgroundColor: "#444",
        color: "#fff",
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#666",
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 10,
    },
    addButton: {
        flex: 1,
        backgroundColor: "#ffd33d",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginRight: 5,
    },
    closeButton: {
        flex: 1,
        backgroundColor: "#d32f2f",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginLeft: 5,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default UserIngredientModal;
