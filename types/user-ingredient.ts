// change back to interface as this may be sending the whold object to the backend
export type UserIngredientInput = {
    userId: string,
    ingredientId: number,
    unitQuantity: number,
    totalAmount: number,
    unitType: string,
    expiryDate: string
}