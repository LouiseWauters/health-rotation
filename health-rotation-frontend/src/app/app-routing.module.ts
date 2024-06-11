import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EatingEventFormComponent} from "./components/eating-event-form/eating-event-form.component";
import {RecommendationsComponent} from "./components/recommendations/recommendations.component";
import {StatisticsComponent} from "./components/statistics/statistics.component";

const routes: Routes = [
  { path: '', component: EatingEventFormComponent},
  { path: 'recommendations', component: RecommendationsComponent},
  { path: 'statistics', component: StatisticsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
