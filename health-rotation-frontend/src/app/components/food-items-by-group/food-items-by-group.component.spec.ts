import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodItemsByGroupComponent } from './food-items-by-group.component';

describe('FoodItemsByGroupComponent', () => {
  let component: FoodItemsByGroupComponent;
  let fixture: ComponentFixture<FoodItemsByGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoodItemsByGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoodItemsByGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
