import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-navbar.component.html',
  styleUrls: ['./user-navbar.component.css']
})
export class UserNavbarComponent {
  isDropdownOpen = false;
  @Output() changePasswordClicked = new EventEmitter<void>();

  constructor(private userService: UserService, private router: Router) {}

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/']);
  }

  navigateToBookingManagement(): void {
    this.router.navigate(['/booking-management']);
    this.isDropdownOpen = false;
  }

  openChangePasswordModal(): void {
    this.changePasswordClicked.emit();
    this.isDropdownOpen = false;
  }
}
