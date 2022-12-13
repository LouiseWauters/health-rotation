import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FoodItem} from "../../models/food-item";
import {FoodItemsByGroupComponent} from "../food-items-by-group/food-items-by-group.component";
import {FoodService} from "../../services/food.service";

@Component({
  selector: 'app-eating-event-form',
  templateUrl: './eating-event-form.component.html',
  styleUrls: ['./eating-event-form.component.css']
})
export class EatingEventFormComponent implements OnInit {

  @ViewChild(FoodItemsByGroupComponent) child!: FoodItemsByGroupComponent;
  ready = false;
  form!: FormGroup;

  old_selected_items: FoodItem[] = [];

  selectedItems: FoodItem[] = [];
  constructor(
    private foodService: FoodService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      date: new FormControl(null, Validators.required)
    });
    this.form.get('date')?.valueChanges.subscribe( date => {
      this.setEatingEvents(date);
    })
  }

  submit(date: Date) : void {
    if (this.form.valid) {
      const old_selected_ids = this.old_selected_items.map(obj => obj.id!);
      const selected_ids = this.selectedItems.map(obj => obj.id!);
      const item_ids_to_delete = this.differenceList(old_selected_ids, selected_ids);
      const item_ids_to_add = this.differenceList(selected_ids, old_selected_ids);
      this.foodService.postEatingEvents(date, item_ids_to_add).subscribe();
      this.foodService.deleteEatingEvents(date, item_ids_to_delete).subscribe();
    }
  }

  changeSelected(foodItems: FoodItem[]) {
    this.selectedItems = foodItems;
  }

  clearSelected() : void {
    this.child?.clearSelected();
  }

  selectItems(items: FoodItem[]) : void {
    this.child?.selectItems(items);
  }

  setEatingEvents(date: Date) {
    this.foodService.getEatingEvents(date).subscribe(data => {
      this.clearSelected();
      this.selectItems(data.map(obj => obj.food_item));
      this.old_selected_items = data.map(obj => obj.food_item);
    });
  }

  setReady() : void {
    this.ready = true;
  }

  differenceList(list1: number[], list2: number[]) {
    // Returns list1 - list2
    return list1.filter(obj => list2.indexOf(obj) < 0);
  }

}
