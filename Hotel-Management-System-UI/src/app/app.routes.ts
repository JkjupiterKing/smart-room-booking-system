import { Routes } from '@angular/router';

import { UserComponent } from './user/user.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RoomBookingComponent } from './roombooking/roombooking.component';
import { PaymentComponent } from './payment/payment.component';



export const routes: Routes = [
  {path: '', component: UserComponent},
  { path: 'user', component: UserComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'roombooking', component: RoomBookingComponent },
  { path: 'payment', component: PaymentComponent },
];
