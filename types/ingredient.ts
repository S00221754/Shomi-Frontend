export interface ProductInfo {
    Ing_id?: number;
    Ing_barcode: string;
    Ing_name: string;
    Ing_brand?: string;
    Ing_keywords?: string[];
    Ing_units?: string[];
    status: boolean;
    In_Database: boolean;
  }

  export interface Ingredient {
    Ing_id: number;
    Ing_name: string;
  }
  
  export interface UserIngredient {
    id: string;
    ingredient: Ingredient;
    unitQuantity: number;
    totalAmount: string;
    unitType: string;
    expiryDate?: string | null;
    addedAt: string;
  }
  