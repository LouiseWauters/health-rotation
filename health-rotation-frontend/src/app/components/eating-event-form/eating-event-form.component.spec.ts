import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EatingEventFormComponent } from './eating-event-form.component';

describe('EatingEventFormComponent', () => {
  let component: EatingEventFormComponent;
  let fixture: ComponentFixture<EatingEventFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EatingEventFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EatingEventFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
