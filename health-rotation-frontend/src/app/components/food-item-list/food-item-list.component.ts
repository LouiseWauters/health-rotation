import {Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {FoodItemList} from "../../models/food-item-list";
import {FoodItem} from "../../models/food-item";
import {FoodItemComponent} from "../food-item/food-item.component";

@Component({
  selector: 'app-food-item-list',
  templateUrl: './food-item-list.component.html',
  styleUrls: ['./food-item-list.component.css']
})
export class FoodItemListComponent implements OnInit {

  @Input() foodItemList: FoodItemList = {title: '', foodItems: [], selected: []};
  @Output() selected = new EventEmitter();

  @ViewChildren(FoodItemComponent) children!: QueryList<FoodItemComponent>;

  constructor() { }

  ngOnInit(): void {
  }

  changeSelected(foodItem: FoodItem) {
    this.foodItemList.selected = this.toggleStringInList(foodItem, this.foodItemList.selected);
    this.selected.emit({title: this.foodItemList.title, selected: this.foodItemList.selected});
  }

  toggleStringInList(item: FoodItem, list: FoodItem[]) {
    const index = list.map(item => item.name).indexOf(item.name);
    if (index >= 0) {
      // String is in the list, remove it.
      list.splice(index, 1);
    } else {
      list.push(item);
    }
    return list;
  }

  clearSelected() : void {
    this.children?.forEach(child => child.clearSelected());
  }

  selectItems(items: FoodItem[]) : void {
    this.children?.forEach(child => child.selectItems(items));
  }
}
