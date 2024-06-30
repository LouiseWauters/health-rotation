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
  successMessage = false;
  successMeter = 0;
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
      this.resetSuccess();
    })
  }

  submit(date: Date) : void {
    this.resetSuccess();
    if (this.form.valid) {
      const old_selected_ids = this.old_selected_items.map(obj => obj.id!);
      const selected_ids = this.selectedItems.map(obj => obj.id!);
      const item_ids_to_delete = this.differenceList(old_selected_ids, selected_ids);
      const item_ids_to_add = this.differenceList(selected_ids, old_selected_ids);
      this.successMeter += (item_ids_to_add.length == 0 ? 1 : 0) + (item_ids_to_delete.length == 0 ? 1 : 0);
      this.successMessage = this.successMeter == 2;
      if (item_ids_to_add.length > 0) {
        this.foodService.postEatingEvents(date, item_ids_to_add).subscribe(data => {
          this.successMeter += 1;
          this.successMessage = this.successMeter == 2;
          // Add added values to the old list (so that they don't get added again)
          this.old_selected_items.push(...this.selectedItems.filter(obj => item_ids_to_add.indexOf(obj.id!) > -1));
        });
      }
      if (item_ids_to_delete.length > 0) {
        this.foodService.deleteEatingEvents(date, item_ids_to_delete).subscribe(data => {
          this.successMeter += 1;
          this.successMessage = this.successMeter == 2;
          // Remove deleted values from the old list (so that they don't get deleted again)
          this.old_selected_items = this.old_selected_items.filter(obj => item_ids_to_delete.indexOf(obj.id!) < 0);
        });
      }
    }
  }

  changeSelected(foodItems: FoodItem[]) {
    this.resetSuccess();
    this.selectedItems = foodItems;
  }

  clearSelected() : void {
    this.child?.clearSelected();
  }

  selectItems(items: FoodItem[]) : void {
    this.child?.selectItems(items);
  }

  setEatingEvents(date: Date) {
    if (!date) {
      this.clearSelected();
      return;
    }
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

  resetSuccess() {
    this.successMeter = 0;
    this.successMessage = false;
  }

}
