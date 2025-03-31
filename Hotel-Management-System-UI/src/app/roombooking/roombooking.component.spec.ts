import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoombookingComponent } from './roombooking.component';

describe('RoombookingComponent', () => {
  let component: RoombookingComponent;
  let fixture: ComponentFixture<RoombookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoombookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoombookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
