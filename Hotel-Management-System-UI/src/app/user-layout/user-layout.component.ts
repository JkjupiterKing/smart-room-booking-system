import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserNavbarComponent } from '../user-navbar/user-navbar.component';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterModule, UserNavbarComponent],
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.css']
})
export class UserLayoutComponent { }
