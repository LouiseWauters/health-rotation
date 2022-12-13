import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {FoodItem} from "../../models/food-item";
import {FoodService} from "../../services/food.service";
import {FoodItemList} from "../../models/food-item-list";
import {FoodItemListComponent} from "../food-item-list/food-item-list.component";

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

  nr_of_recommendations = 10;

  @ViewChildren(FoodItemListComponent) children!: QueryList<FoodItemListComponent>;
  foodItemListChild!: FoodItemListComponent;

  constructor(
    private foodService: FoodService
  ) { }

  ngOnInit(): void {
    this.getRecommendations();
  }

  getRecommendations(): void {
    this.saveExcluded();
    // this.clearSelected();
    const extraRecommendationsNeeded = this.nr_of_recommendations - this.selected.length;
    this.foodService.getRecommendations([...this.excluded, ...this.selected], extraRecommendationsNeeded)
      .subscribe(recommendations => {
      const newItems = [...this.selected];
      newItems.push(...recommendations.filter(obj => {
        const index = this.items.map(item => item.id).indexOf(obj.id);
        return index < 0;
      }));
      this.items = newItems;
      this.ready = true;
      if (this.selected.length > 0) {
        this.selectItems(this.selected);
      }
    });
  }

  loadNewRecommendations() {
    // this.ready = false; TODO if this is set to false, the component dissappears, so maybe just hide it?
    this.getRecommendations();
  }

  changeSelected($event: FoodItemList) {
    this.selected = $event.selected!;
  }

  saveExcluded() {
    const toExclude = this.items.filter(obj => {
      const index = this.selected.map(item => item.name).indexOf(obj.name);
      return index < 0;
    });
    this.excluded.push(...toExclude);
  }

  clearSelected() {
    this.children?.forEach(child => child.clearSelected());
  }

  ngAfterViewInit(): void {
    this.children.changes.subscribe((comps: QueryList<FoodItemListComponent>) => {
      this.foodItemListChild = comps.first;
    });
  }

  selectItems(items: FoodItem[]) {
    this.foodItemListChild?.selectItems(items);
  }
}
