import {FoodItem} from "./food-item";

export interface EatingEvent {
  date: Date;
  food_item: FoodItem;
}
