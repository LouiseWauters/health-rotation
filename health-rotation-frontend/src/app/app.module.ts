import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FoodItemComponent } from './components/food-item/food-item.component';
import { FoodItemListComponent } from './components/food-item-list/food-item-list.component';
import { FoodItemsByGroupComponent } from './components/food-items-by-group/food-items-by-group.component';
import { EatingEventFormComponent } from './components/eating-event-form/eating-event-form.component';
import { LoadSpinnerComponent } from './components/load-spinner/load-spinner.component';
import {ReactiveFormsModule} from "@angular/forms";
import { RecommendationsComponent } from './components/recommendations/recommendations.component';
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    FoodItemComponent,
    FoodItemListComponent,
    FoodItemsByGroupComponent,
    EatingEventFormComponent,
    LoadSpinnerComponent,
    RecommendationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
