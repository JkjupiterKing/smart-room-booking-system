import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomBookingAiAgentComponent } from './room-booking-ai-agent.component';

describe('RoomBookingAiAgentComponent', () => {
  let component: RoomBookingAiAgentComponent;
  let fixture: ComponentFixture<RoomBookingAiAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomBookingAiAgentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomBookingAiAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
