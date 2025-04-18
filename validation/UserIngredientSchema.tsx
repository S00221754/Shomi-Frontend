import * as Yup from "yup";

const AddUserIngredientSchema = Yup.object().shape({
  unitQuantity: Yup.number()
    .required("Quantity is required")
    .min(1, "Quantity must be at least 1"),
  expiry_date: Yup.string().nullable(),
});

export default AddUserIngredientSchema;