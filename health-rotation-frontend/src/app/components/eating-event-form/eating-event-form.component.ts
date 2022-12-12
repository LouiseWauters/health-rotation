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

  old_items: FoodItem[] = [];

  selectedItems: FoodItem[] = [];
  constructor(
    private foodService: FoodService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      date: new FormControl(null, Validators.required)
    });
    this.form.get('date')?.valueChanges.subscribe( x => {
      this.setEatingEvents(x);
    })
  }

  submit(date: Date) : void {
    if (this.form.valid) {
      console.log(date, this.selectedItems);
      this.selectedItems.forEach(item => {
        this.foodService.postEatingEvent(
          {date: date, foodItem: item}
        );
      });
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

  setEatingEvents(date: string) {
    this.foodService.getEatingEvents(new Date(date)).subscribe(data => {
      this.clearSelected();
      this.selectItems(data.map(obj => obj.foodItem));
    });
  }

  setReady() : void {
    this.ready = true;
  }

}
