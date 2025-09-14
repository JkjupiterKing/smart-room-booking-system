import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { SearchResultsService, Hotel } from '../search-results.service';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../user.service';
import { AdminService } from '../admin.service';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { HttpErrorResponse } from '@angular/common/http';
import { PublicNavbarComponent } from '../public-navbar/public-navbar.component';
import { AppUserNavbarComponent } from '../app-user-navbar/app-user-navbar.component';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminNavbarComponent,
    PublicNavbarComponent,
    AppUserNavbarComponent,
  ],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
})
export class SearchResultsComponent implements OnInit {
  hotels$: Observable<Hotel[]>;
  private filteredHotelsSubject = new BehaviorSubject<Hotel[]>([]);
  filteredHotels$ = this.filteredHotelsSubject.asObservable();
  allHotels: Hotel[] = [];
  isLoading$: Observable<boolean>;

  isLoggedIn: boolean = false;
  userRole: string | null = null;
  isLoginModalOpen: boolean = false;
  isRegisterModalOpen: boolean = false;
  registrationSuccess: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

hotelIds: any;
city: string = '';
checkIn: string = '';
checkOut: string = '';

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
      this.hotelIds = params['hotelIds'];
      this.city = params['city'];
      this.checkIn = params['checkIn'];
      this.checkOut = params['checkOut'];

      if (this.hotelIds) {
        this.searchResultsService.fetchHotelsByIds(this.hotelIds).subscribe((hotels) => {
          this.allHotels = hotels;
          this.filteredHotelsSubject.next(hotels);
        });
      } else if (this.city) {
        this.searchResultsService
          .fetchHotelsByCity(this.city, this.checkIn, this.checkOut)
          .subscribe((hotels) => {
            this.allHotels = hotels;
            this.filteredHotelsSubject.next(hotels);
          });
      }
    });

    this.hotels$.subscribe(hotels => {
      this.allHotels = hotels;
      this.filteredHotelsSubject.next(hotels);
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
    // this.router.navigate(['/hotel-details', hotelId]);
    this.router.navigate(['/hotel-details', hotelId], {
        queryParams: {
          city: this.city,
          checkIn: this.checkIn,
          checkOut: this.checkOut,
        },
      });
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
            .navigate(['/landing-page'])
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

  // Filter properties
  popularFilters = {
    singleBed: false,
    doubleBed: false,
    luxuryRoom: false,
    familySuite: false,
  };

  priceFilters = {
    '0-500': false,
    '500-1000': false,
    '1000-2000': false,
    '2000-3000': false,
  };

  sortBy: string = 'priceLowToHigh';

  onPopularFilterChange(filter: keyof typeof this.popularFilters, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.popularFilters[filter] = isChecked;
    this.applyFilters();
  }

  onPriceFilterChange(filter: keyof typeof this.priceFilters, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.priceFilters[filter] = isChecked;
    this.applyFilters();
  }

  onSortChange(event: Event) {
    this.sortBy = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.allHotels];

    // Popular filters
    const selectedPopularFilters = Object.entries(this.popularFilters)
      .filter(([, value]) => value)
      .map(([key]) => key);

    if (selectedPopularFilters.length > 0) {
      filtered = filtered.filter(hotel => {
        return selectedPopularFilters.every(filter => {
          if (filter === 'singleBed') return hotel.name.toLowerCase().includes('single bed');
          if (filter === 'doubleBed') return hotel.name.toLowerCase().includes('double bed');
          if (filter === 'luxuryRoom') return hotel.name.toLowerCase().includes('luxury room');
          if (filter === 'familySuite') return hotel.name.toLowerCase().includes('family suite');
          return true;
        });
      });
    }

    // Price filtering
    const selectedPriceRanges = Object.entries(this.priceFilters)
      .filter(([, value]) => value)
      .map(([key]) => key);

    if (selectedPriceRanges.length > 0) {
      filtered = filtered.filter(hotel => {
        return selectedPriceRanges.some(range => {
          const [min, max] = range.split('-').map(Number);
          return hotel.price >= min && hotel.price <= max;
        });
      });
    }

    // Sorting
    switch (this.sortBy) {
      case 'priceLowToHigh':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'priceHighToLow':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newestFirst':
        // Assuming 'id' represents creation order
        filtered.sort((a, b) => b.id - a.id);
        break;
    }

    this.filteredHotelsSubject.next(filtered);
  }

  clearFilters() {
    for (const key in this.popularFilters) {
      this.popularFilters[key as keyof typeof this.popularFilters] = false;
    }
    for (const key in this.priceFilters) {
      this.priceFilters[key as keyof typeof this.priceFilters] = false;
    }
    this.sortBy = 'priceLowToHigh';
    this.applyFilters();
  }
}
