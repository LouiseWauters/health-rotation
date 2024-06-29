import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FoodItem} from "../../models/food-item";

@Component({
  selector: 'app-food-item',
  templateUrl: './food-item.component.html',
  styleUrls: ['./food-item.component.css']
})
export class FoodItemComponent implements OnInit {

  @Input() foodItem: FoodItem = {name: ''};
  @Input() selected = false;

  @Input() mean = 0;
  @Input() std = 0;
  @Output() wasSelected = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
  }

  changeSelected() {
    this.selected = !this.selected;
    this.wasSelected.emit(this.foodItem);
  }

  clearSelected() {
    if (this.selected) {
      this.changeSelected();
    }
  }

  selectItems(items: FoodItem[]) {
    const index = items.map(item => item.name).indexOf(this.foodItem.name);
    if (index >= 0 && !this.selected) {
      this.changeSelected();
    }
  }
  get frequent() {
    if (this.mean == 0 || this.foodItem.eaten === undefined) {
      return 0
    }
    if (this.foodItem.eaten.length >= this.mean + this.std) {
      return 1
    }
    if (this.foodItem.eaten.length <= Math.max(this.mean - this.std, 0)) {
      return -1
    }
    return 0
  }
}
