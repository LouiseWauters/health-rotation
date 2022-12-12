import {FoodItem} from "./food-item";

export interface FoodItemList {
  title: string;
  foodItems: FoodItem[];
  selected: FoodItem[];
}
