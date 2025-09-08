import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { UserService } from '../user.service';
import { ChangePasswordModalComponent } from '../change-password-modal/change-password-modal.component';

@Component({
  selector: 'app-user-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ChangePasswordModalComponent],
  templateUrl: './app-user-navbar.component.html',
  styleUrls: ['./app-user-navbar.component.css']
})
export class AppUserNavbarComponent implements OnInit {
  isUserLoggedIn: boolean = false;
  userInitial: string | null = null;
  isDropdownOpen: boolean = false;
  isPasswordModalOpen: boolean = false;
  userId: number | null = null;

  constructor(
    private userService: UserService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const role = localStorage.getItem('role');

      if (user && user.id && role === 'user') {
        this.isUserLoggedIn = true;
        this.userInitial = user.username.charAt(0).toUpperCase();
        this.userId = user.id;
      }
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  navigateToBookingManagement(): void {
    this.router.navigate(['/my-bookings']);
    this.isDropdownOpen = false;
  }

  openPasswordModal(): void {
    this.isPasswordModalOpen = true;
    this.isDropdownOpen = false;
  }

  closePasswordModal(): void {
    this.isPasswordModalOpen = false;
  }

  handlePasswordChange(newPassword: string): void {
    if (!this.userId) {
      console.error('User ID not found');
      return;
    }
    this.userService.updatePassword(this.userId, newPassword).subscribe({
      next: () => {
        console.log('Password updated successfully');
        this.closePasswordModal();
      },
      error: (err) => {
        console.error('Error updating password', err);
      }
    });
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      this.isUserLoggedIn = false;
      this.userInitial = null;

      if (this.router.url === '/landing-page') {
        this.router.navigate(['/landing-page']).then(() => {
          window.location.reload();
        });
      } else {
        this.router.navigate(['/landing-page']);
      }
    }
  }
}
