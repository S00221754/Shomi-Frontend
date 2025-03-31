import * as Yup from "yup";

const recipeValidationSchema = Yup.object().shape({
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

export default recipeValidationSchema;
