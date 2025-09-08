import { Routes } from '@angular/router';
import { LandingPageComponent } from './user/landing-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RoomBookingComponent } from './roombooking/roombooking.component';
import { PaymentComponent } from './payment/payment.component';
import { LocationComponent } from './location/location.component';
import { HotelManagementComponent } from './hotel-management/hotel-management.component';
import { RoomTypeManagementComponent } from './room-type-management/room-type-management.component';
import { RoomManagementComponent } from './room-management/room-management.component';
import { BookingManagementComponent } from './booking-management/booking-management.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { HotelDetailsComponent } from './hotel-details/hotel-details.component';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'landing-page', pathMatch: 'full' },
  { path: 'search-results', component: SearchResultsComponent },
  { path: 'hotel-details/:id', component: HotelDetailsComponent },
  { path: 'landing-page', component: LandingPageComponent },
  {
    path: 'user',
    component: UserLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'booking-management', component: BookingManagementComponent },
      { path: 'roombooking', component: RoomBookingComponent },
      { path: 'payment', component: PaymentComponent },
    ],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'locations', component: LocationComponent },
      { path: 'room-types', component: RoomTypeManagementComponent },
      { path: 'rooms', component: RoomManagementComponent },
      { path: 'booking-management', component: BookingManagementComponent },
      { path: 'hotel-management', component: HotelManagementComponent },
    ],
  },
  { path: 'admin/login', component: AdminLoginComponent },
];
