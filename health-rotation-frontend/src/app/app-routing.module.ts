import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EatingEventFormComponent} from "./components/eating-event-form/eating-event-form.component";
import {RecommendationsComponent} from "./components/recommendations/recommendations.component";

const routes: Routes = [
  { path: '', component: EatingEventFormComponent},
  { path: 'recommendations', component: RecommendationsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
