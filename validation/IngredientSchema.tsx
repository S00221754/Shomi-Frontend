import * as Yup from "yup";

const IngredientSchema = Yup.object().shape({
  Ing_name: Yup.string().required("Product name is required"),
  Ing_brand: Yup.string().required("Brand is required"),
  Ing_quantity: Yup.string()
    .required("Quantity is required")
    .matches(/^[0-9]*\.?[0-9]+$/, "Must be a valid number"),
  Ing_quantity_units: Yup.string().required("Unit type is required"),
});

export default IngredientSchema;
