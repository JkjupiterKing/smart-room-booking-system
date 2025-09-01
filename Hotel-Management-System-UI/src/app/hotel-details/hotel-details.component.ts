import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService } from '../hotel/hotel.service';
import { Hotel } from '../search-results.service';
import { UserNavbarComponent } from '../user-navbar/user-navbar.component';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import {
  FormsModule,
  NgForm
} from '@angular/forms';
import {
  UserService
} from '../user.service';
import {
  AdminService
} from '../admin.service';
import {
  HttpErrorResponse
} from '@angular/common/http';

@Component({
  selector: 'app-hotel-details',
  standalone: true,
  imports: [CommonModule, UserNavbarComponent, AdminNavbarComponent, FormsModule],
  templateUrl: './hotel-details.component.html',
  styleUrls: ['./hotel-details.component.css']
})
export class HotelDetailsComponent implements OnInit {

  hotel: Hotel | undefined;
  images: string[] = [];
  isLoggedIn: boolean = false;
  userRole: string | null = null;
  isLoginModalOpen: boolean = false;
  isRegisterModalOpen: boolean = false;
  registrationSuccess: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  user = {
    name: '',
    email: '',
    password: '',
  };

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelService,
    private router: Router,
    private userService: UserService,
    private adminService: AdminService
  ) {}

  bookNow(): void {
    if (!this.hotel) {
      alert('No hotel selected');
      return;
    }

  const city = this.hotel.location?.city || '';
  const hotelId = this.hotel.id;
  // Navigate to the room booking component and pass the city and hotelId as query params
  this.router.navigate(['/user/roombooking'], { queryParams: { location: city, hotelId } });
  }

  ngOnInit(): void {
    this.checkUserStatus();
    const hotelId = this.route.snapshot.paramMap.get('id');
    if (hotelId) {
      this.hotelService.getHotelById(+hotelId).subscribe(hotel => {
        this.hotel = hotel;
  // build images array from available base64 fields, detect MIME from signature
  this.images = [];
  const pushIf = (b64?: string) => {
    if (b64 && b64.length > 10) {
      this.images.push(this.getImageDataUri(b64));
    }
  };
  pushIf((hotel as any).imageBase64);
  pushIf((hotel as any).imageBase64_2);
  pushIf((hotel as any).imageBase64_3);
  pushIf((hotel as any).imageBase64_4);
  pushIf((hotel as any).imageBase64_5);
      });
    }
  }

  /**
   * Create data URI with a guessed mime type from base64 signature.
   */
  getImageDataUri(b64: string): string {
    const sig = b64.slice(0, 8);
    let mime = 'jpeg';
    // PNG files often start with "iVBOR" in base64, JPEG often "/9j/"
    if (sig.startsWith('iVBOR')) { mime = 'png'; }
    else if (sig.startsWith('/9j/')) { mime = 'jpeg'; }
    else if (sig.toLowerCase().includes('png')) { mime = 'png'; }
    return `data:image/${mime};base64,${b64}`;
  }

  checkUserStatus(): void {
    if (typeof localStorage !== 'undefined') {
      const role = localStorage.getItem('role');
      if (role) {
        this.isLoggedIn = true;
        this.userRole = role;
      }
    }
  }

  getStarArray(rating: number): number[] {
    const fullStars = Math.floor(rating);
    return Array(fullStars).fill(0);
  }

  // Modal controls
  openLoginModal() {
    this.isLoginModalOpen = true;
    this.isRegisterModalOpen = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeLoginModal() {
    this.isLoginModalOpen = false;
  }

  openRegisterModal() {
    this.isRegisterModalOpen = true;
    this.isLoginModalOpen = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeRegisterModal() {
    this.isRegisterModalOpen = false;
  }

  onLoginSubmit(loginForm: NgForm) {
    if (loginForm.valid) {
      const {
        username,
        password
      } = loginForm.value;

      this.userService.loginUser(username, password).subscribe({
        next: (response) => {
          if (response && response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('role', 'user');
          }

          this.successMessage = 'Login successful!';
          this.router
            .navigate(['/user/dashboard'])
            .then(() => window.location.reload());
          this.closeLoginModal();
          loginForm.reset();
        },
        error: (userError: HttpErrorResponse) => {
          this.adminService.loginAdmin(username, password).subscribe({
            next: () => {
              localStorage.setItem('admin', JSON.stringify({
                username
              }));
              localStorage.setItem('role', 'admin');

              this.successMessage = 'Admin login successful!';
              this.router
                .navigate(['/admin/dashboard'])
                .then(() => window.location.reload());
              this.closeLoginModal();
              loginForm.reset();
            },
            error: () => {
              this.errorMessage =
                'Invalid Credentials for both Customer and Admin.';
              alert(this.errorMessage);
            },
          });
        },
      });
    }
  }

  onRegisterSubmit(registerForm: NgForm) {
    if (registerForm.valid) {
      this.userService.registerUser(registerForm.value).subscribe({
        next: (response) => {
          if (response && response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('role', 'user');
          }

          this.successMessage = 'Registration successful!';
          this.registrationSuccess = true;
          this.closeRegisterModal();
          registerForm.reset();

          setTimeout(() => {
            this.registrationSuccess = false;
            this.openLoginModal();
            window.location.reload();
          }, 2000);
        },
        error: (error) => {
          if (error instanceof HttpErrorResponse) {
            this.errorMessage = error.error || 'Error registering user';
          } else {
            this.errorMessage = 'An unexpected error occurred';
          }

          alert(this.errorMessage);
        },
      });
    }
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    localStorage.removeItem('role');
    this.isLoggedIn = false;
    this.userRole = null;
    this.router.navigate(['/landing-page']).then(() => {
      window.location.reload();
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
