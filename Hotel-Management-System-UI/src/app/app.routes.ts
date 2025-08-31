import { Routes } from '@angular/router';

import { LandingPageComponent } from './user/landing-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RoomBookingComponent } from './roombooking/roombooking.component';
import { PaymentComponent } from './payment/payment.component';
import { LocationComponent } from './location/location.component';
import { HotelManagementComponent } from './hotel-management/hotel-management.component';
import { RoomTypeManagementComponent } from './room-type-management/room-type-management.component';
import { BookingManagementComponent } from './booking-management/booking-management.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { RoomBookingAiAgentComponent } from './room-booking-ai-agent/room-booking-ai-agent.component'; // Import the new component
import { SearchResultsComponent } from './search-results/search-results.component';

export const routes: Routes = [
  { path: '', redirectTo: 'landing-page', pathMatch: 'full' },
  { path: 'search-results', component: SearchResultsComponent },
  { path: 'landing-page', component: LandingPageComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'roombooking', component: RoomBookingComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'location', component: LocationComponent },
  { path: 'hotel-management', component: HotelManagementComponent },
  { path: 'room-types', component: RoomTypeManagementComponent },
  { path: 'booking-management', component: BookingManagementComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'room-booking-ai-agent', component: RoomBookingAiAgentComponent }, // Added route for AI Agent
];
