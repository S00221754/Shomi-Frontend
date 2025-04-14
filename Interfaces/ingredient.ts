import { IngredientCategory } from "./ingredient-category";

export interface ProductInfo {
  Ing_id?: number;
  Ing_barcode: string;
  Ing_name: string;
  Ing_brand?: string;
  Ing_keywords?: string[];
  Ing_quantity?: number;
  Ing_quantity_units?: string;
  category?: IngredientCategory;
  status: boolean;
  In_Database: boolean;
}

export interface Ingredient {
  Ing_id: number;
  Ing_name: string;
  Ing_quantity?: number;
  Ing_quantity_units?: string;
}

export interface UserIngredient {
  id: string;
  ingredient: Ingredient;
  unitQuantity: number;
  totalAmount: string;
  unitType: string;
  expiry_date?: string | null;
  addedAt: string;
}

export type SelectedIngredient = {
  ingredient_id: string;
  ingredient_name: string;
  quantity: number;
  unit: string;
};

export enum ExpiryStatus {
  Expired = "Expired",
  Soon = "Expiring Soon",
  Fresh = "Fresh",
}

export enum QuantityStatus {
  OutOfStock = "Out of Stock",
  Low = "Low Supply",
  InStock = "In Stock",
}
