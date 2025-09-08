import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { UserService } from './user.service';
import { PublicNavbarComponent } from './public-navbar/public-navbar.component';
import { UserNavbarComponent } from './user-navbar/user-navbar.component';
import { AdminNavbarComponent } from './admin-navbar/admin-navbar.component';
import { ChangePasswordModalComponent } from './change-password-modal/change-password-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    PublicNavbarComponent,
    UserNavbarComponent,
    AdminNavbarComponent,
    ChangePasswordModalComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Hotel-Management-System-UI';
  showLoginModal = false;
  showRegisterModal = false;
  showChangePasswordModal = false;

  constructor(private userService: UserService) {}

  isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.userService.isAdmin();
  }

  openLoginModal() {
    this.showLoginModal = true;
  }

  closeLoginModal() {
    this.showLoginModal = false;
  }

  openRegisterModal() {
    this.showRegisterModal = true;
  }

  closeRegisterModal() {
    this.showRegisterModal = false;
  }

  openChangePasswordModal() {
    this.showChangePasswordModal = true;
  }

  closeChangePasswordModal() {
    this.showChangePasswordModal = false;
  }
}
