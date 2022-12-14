import { Injectable } from '@angular/core';
import {FoodItemList} from "../models/food-item-list";
import {FOOD_ITEMS} from "../mock-data/mock-items";
import {Observable, of} from "rxjs";
import {EatingEvent} from "../models/eating-event";
import {FoodItem} from "../models/food-item";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {API_URL} from "../env";

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(
    private http: HttpClient
  ) { }

  getItemsByGroup(): Observable<FoodItemList[]> {
    return this.http.get<FoodItemList[]>(`${API_URL}/food-items`);
  }

  getRecommendations(excludedItems: FoodItem[], limit: number): Observable<FoodItem[]> {
    const httpOptions = {
      params: new HttpParams()
        .set('limit', limit.toString())
    }
    if (excludedItems.length > 0) {
      httpOptions.params = httpOptions.params.set('excluded', excludedItems.map(obj => obj.id!).toString());
    }
    return this.http.get<FoodItem[]>(`${API_URL}/recommendations`, httpOptions);
  }

  postEatingEvents(date: Date, foodItemIds: number[]) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const body = JSON.stringify({date: date, food_item_ids: foodItemIds});
    return this.http.post(`${API_URL}/eating-events`, body, httpOptions);
  }

  deleteEatingEvents(date: Date, foodItemIds: number[]) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({date: date, food_item_ids: foodItemIds})
    };
    return this.http.delete(`${API_URL}/eating-events`, httpOptions);
  }

  getEatingEvents(date: Date): Observable<EatingEvent[]> {
    const httpOptions = {
      params: new HttpParams()
        .set('date', date.toString())
    };
    return this.http.get<EatingEvent[]>(`${API_URL}/eating-events`, httpOptions);
  }

  postFoodItem(item: FoodItem) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const body = JSON.stringify(item);
    return this.http.post<FoodItem>(`${API_URL}/food-items`, body, httpOptions)
  }

  postFoodCategory(category: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const body = JSON.stringify({name: category});
    return this.http.post<any>(`${API_URL}/food-categories`, body, httpOptions)
  }

  postMockData() {
    FOOD_ITEMS.forEach(obj => {
      this.postFoodCategory(obj.name).subscribe(data => {
        obj.food_items.forEach(item => {
          item.food_category_id = data.id;
          this.postFoodItem(item).subscribe();
        });
      });
    });
  }
}
