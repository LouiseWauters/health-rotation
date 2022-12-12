import { Component, OnInit } from '@angular/core';
import {FoodItem} from "../../models/food-item";
import {FoodService} from "../../services/food.service";
import {FoodItemList} from "../../models/food-item-list";

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.css']
})
export class RecommendationsComponent implements OnInit {

  items: FoodItem[] = [];
  excluded: FoodItem[] = [];
  selected: FoodItem[] = [];
  ready = false;

  constructor(
    private foodService: FoodService
  ) { }

  ngOnInit(): void {
    this.getRecommendations();
  }

  getRecommendations(): void {
    this.saveExcluded();
    this.foodService.getRecommendations(this.excluded).subscribe(recommendations => {
      this.items = recommendations;
      this.ready = true;
    });
  }

  loadNewRecommendations() {
    this.ready = false;
    this.getRecommendations();
  }

  changeSelected($event: FoodItemList) {
    this.selected = $event.selected;
  }

  saveExcluded() {
    const toExclude = this.items.filter(obj => {
      const index = this.selected.map(item => item.name).indexOf(obj.name);
      return index < 0;
    });
    this.excluded.push(...toExclude);
  }
}
