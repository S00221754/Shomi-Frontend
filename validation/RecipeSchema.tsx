import * as Yup from "yup";

// This schema is used to validate the recipe ingredient form inputs
export const recipeValidationSchema = Yup.object().shape({
  recipe_name: Yup.string().required("Recipe name is required"),
  recipe_description: Yup.string().required("Short description is required"),
  cooking_time: Yup.number()
    .typeError("Cooking time must be a number")
    .positive("Cooking time must be positive")
    .required("Cooking time is required"),
  recipe_instructions: Yup.string().required("Instructions are required"),
  ingredients: Yup.array()
    .of(
      Yup.object().shape({
        ingredient_id: Yup.string().required(),
        quantity: Yup.number().required(),
        unit: Yup.string().required(),
      })
    )
    .min(3, "At least 3 ingredients are required"),
});

// This schema is used to validate the recipe ingredient form inputs
export const recipeIngredientValidationSchema = Yup.object().shape({
  ingredient_name: Yup.string().required("Ingredient is required"),
  quantity: Yup.number().required("Quantity is required").min(0.01),
  unit: Yup.string().required("Unit is required"),
});
