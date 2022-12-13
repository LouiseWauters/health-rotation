import {Component, EventEmitter, OnInit, Output, QueryList, ViewChildren} from '@angular/core';
import {FoodItemList} from "../../models/food-item-list";
import {FoodService} from "../../services/food.service";
import {FoodItem} from "../../models/food-item";
import {FoodItemListComponent} from "../food-item-list/food-item-list.component";

@Component({
  selector: 'app-food-items-by-group',
  templateUrl: './food-items-by-group.component.html',
  styleUrls: ['./food-items-by-group.component.css']
})
export class FoodItemsByGroupComponent implements OnInit {

  items: FoodItemList[] = [];
  @Output() selectedItems = new EventEmitter();
  @Output() itemsLoaded = new EventEmitter();
  @ViewChildren(FoodItemListComponent) children!: QueryList<FoodItemListComponent>;

  constructor(
    private foodService: FoodService
  ) { }

  ngOnInit(): void {
    this.getFoodItems();
  }

  changeSelected(object: any) {
    this.items.filter(obj => obj.name == object.title).map(obj => obj.selected = object.selected);
    this.selectedItems.emit(this.selected);
  }

  sortFoodItemList() {
    this.items.forEach(itemList => itemList.food_items.sort((a, b) => a.name.localeCompare(b.name)));
  }

  getFoodItems() {
    this.foodService.getItemsByGroup().subscribe(data => {
      data.forEach(obj => obj.selected = []);
      this.items = data;
      this.sortFoodItemList();
      this.itemsLoaded.emit(true);
    }, error => console.log(error));
  }

  clearSelected() {
    this.children?.forEach(child => child.clearSelected());
  }

  selectItems(items: FoodItem[]) {
    this.children?.forEach(child => child.selectItems(items));
  }

  get selected() : FoodItem[] {
    return this.items.map(obj => obj.selected!).flat(1);
  }
}
