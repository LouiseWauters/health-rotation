import {FoodItem} from "./food-item";

export interface FoodItemList {
  name: string;
  food_items: FoodItem[];
  selected?: FoodItem[];
  mean?: number;
  std?: number;
}
