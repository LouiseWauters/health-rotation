import { Injectable } from '@angular/core';
import {FoodItemList} from "../models/food-item-list";
import {FOOD_ITEMS} from "../mock-data/mock-items";
import {Observable, of} from "rxjs";
import {EatingEvent} from "../models/eating-event";
import {FoodItem} from "../models/food-item";
import {RECOMMENDATIONS} from "../mock-data/mock-recommendations";
import {EATING_EVENTS} from "../mock-data/mock-eating-events";

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor() { }

  getItemsByGroup(): Observable<FoodItemList[]> {
    return of(FOOD_ITEMS);
  }

  getRecommendations(excludedItems: FoodItem[]): Observable<FoodItem[]> {
    const filteredRecommendations = RECOMMENDATIONS.filter(obj => {
      const index = excludedItems.map(item => item.name).indexOf(obj.name);
      return index < 0;
    })
    return of(filteredRecommendations);
  }

  postEatingEvent(event: EatingEvent) {
    console.log(event);
  }

  getEatingEvents(date: Date): Observable<EatingEvent[]> {
    const eatingEvents = EATING_EVENTS.filter(obj => obj.date.getTime() == date.getTime());
    return of(eatingEvents);
  }
}
