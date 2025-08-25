import { Routes } from '@angular/router';

import { UserComponent } from './user/user.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RoomBookingComponent } from './roombooking/roombooking.component';
import { PaymentComponent } from './payment/payment.component';
import { LocationComponent } from './location/location.component';
import { HotelManagementComponent } from './hotel-management/hotel-management.component';
import { RoomTypeManagementComponent } from './room-type-management/room-type-management.component';
import { BookingManagementComponent } from './booking-management/booking-management.component'; 
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  { path: '', component: UserComponent },
  { path: 'user', component: UserComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'roombooking', component: RoomBookingComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'location', component: LocationComponent },
  { path: 'hotel-management', component: HotelManagementComponent },
  { path: 'room-types', component: RoomTypeManagementComponent },
  { path: 'booking-management', component: BookingManagementComponent }, 
  { path: 'admin-dashboard', component: AdminDashboardComponent },
];
