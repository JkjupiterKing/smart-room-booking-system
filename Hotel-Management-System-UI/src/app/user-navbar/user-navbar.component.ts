import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangePasswordModalComponent } from '../change-password-modal/change-password-modal.component';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ChangePasswordModalComponent],
  templateUrl: './user-navbar.component.html',
  styleUrls: ['./user-navbar.component.css']
})
export class UserNavbarComponent implements OnInit {
  userRole: string | null = null;
  userInitial: string | null = null;
  isDropdownOpen = false;
  isPasswordModalOpen = false;
  userId: number | null = null;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.userRole = localStorage.getItem('role');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user && user.username) {
        this.userInitial = user.username.charAt(0).toUpperCase();
        this.userId = user.id;
      }
    }
  }

  isUser(): boolean {
    return this.userRole === 'user';
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
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
      this.userRole = null;
      this.router.navigate(['/landing-page']);
    }
  }
}
