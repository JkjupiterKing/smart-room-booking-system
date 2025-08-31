import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { Observable } from 'rxjs';
import { SearchResultsService, Hotel } from '../search-results.service';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../user.service';
import { AdminService } from '../admin.service';
import { UserNavbarComponent } from '../user-navbar/user-navbar.component';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UserNavbarComponent,
    AdminNavbarComponent,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
})
export class SearchResultsComponent implements OnInit {
  hotels$: Observable<Hotel[]>;
  isLoading$: Observable<boolean>;

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
    private searchResultsService: SearchResultsService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private adminService: AdminService
  ) {
    this.hotels$ = this.searchResultsService.hotels$;
    this.isLoading$ = this.searchResultsService.isLoading$;
  }

  ngOnInit(): void {
    this.checkUserStatus();
    this.route.queryParams.subscribe((params) => {
      const city = params['city'];
      const checkIn = params['checkIn'];
      const checkOut = params['checkOut'];

      if (city) {
        this.searchResultsService
          .fetchHotelsByCity(city, checkIn, checkOut)
          .subscribe();
      }
    });
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

  navigateToHotel(hotelId: number): void {
    this.router.navigate(['/hotel-details', hotelId]);
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
      const { username, password } = loginForm.value;

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
              localStorage.setItem('admin', JSON.stringify({ username }));
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
