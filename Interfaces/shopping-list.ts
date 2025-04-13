import { ProductInfo } from "./ingredient";

export interface ShoppingItem {
  Shop_id: string;
  ingredient_id: number;
  user_id: string;
  Shop_quantity: number;
  Shop_added_automatically: boolean;
  Shop_reason: string;
  Shop_created_at: string;
  ingredient: ProductInfo;
}

export interface ShoppingItemInput {
  user_id: string;
  ingredient_id: number;
  Shop_quantity: number;
  Shop_added_automatically: boolean;
  Shop_reason: string;
}
