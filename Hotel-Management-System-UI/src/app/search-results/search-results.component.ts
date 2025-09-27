import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { SearchResultsService, Hotel } from '../search-results.service';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../user.service';
import { AdminService } from '../admin.service';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { HttpErrorResponse } from '@angular/common/http';
import { PublicNavbarComponent } from '../public-navbar/public-navbar.component';
import { AppUserNavbarComponent } from '../app-user-navbar/app-user-navbar.component';
import { RoomTypeService } from '../room-type.service';
import { RoomType } from '../room-type.model';
import { Room } from '../room.model';
import { RoomService } from '../room.service';

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
  allRoomTypes: RoomType[] = [];
  hotelRooms: Room[] = [];
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
    private adminService: AdminService,
    private roomTypeService: RoomTypeService,
    private roomService: RoomService
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
        this.searchResultsService
          .fetchHotelsByIds(this.hotelIds)
          .subscribe((hotels) => {
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
    this.hotels$.subscribe((hotels) => {
      this.allHotels = hotels;
      this.filteredHotelsSubject.next(hotels);
    });

    forkJoin({
      roomTypes: this.roomTypeService.getRoomTypes(),
      rooms: this.roomService.getRooms(),
    }).subscribe(({ roomTypes, rooms }) => {
      this.allRoomTypes = roomTypes.filter(rt => rt.id !== undefined);
      this.hotelRooms = rooms;
      this.initializeFilters();
    });
  }
  initializeFilters(): void {
    this.allRoomTypes.forEach((rt) => {
        if (rt.id) {
            this.roomFilters[rt.id] = false;
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
  getStarArray(rating: number): any[] {
    const fullStars = Math.floor(rating);
    return Array(fullStars).fill(0);
  }
  navigateToHotel(hotelId: number): void {
    this.router.navigate(['/hotel-details', hotelId], {
      queryParams: {
        city: this.city,
        checkIn: this.checkIn,
        checkOut: this.checkOut,
      },
    });
  }
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
  roomFilters: { [key: number]: boolean } = {};
  ratingFilters: { [key: number]: boolean } = {
    3: false,
    4: false,
    5: false,
  };
  priceFilters = {
    '0-500': false,
    '500-1000': false,
    '1000-2000': false,
    '2000-3000': false,
  };
  sortBy: string = 'priceLowToHigh';
  onRoomFilterChange(roomTypeId: number, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.roomFilters[roomTypeId] = isChecked;
    this.applyFilters();
  }
  onRatingFilterChange(rating: number, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.ratingFilters[rating] = isChecked;
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

    const selectedRoomTypes = Object.entries(this.roomFilters)
      .filter(([, value]) => value)
      .map(([key]) => parseInt(key, 10));

    if (selectedRoomTypes.length > 0) {
      const roomTypeNames = new Set<string>();
      this.allRoomTypes.forEach((rt) => {
        if (rt.id && selectedRoomTypes.includes(rt.id)) {
          roomTypeNames.add(rt.name);
        }
      });

      const filteredHotelIds = new Set<number>();
      this.hotelRooms.forEach((room) => {
        if (roomTypeNames.has(room.roomType)) {
          filteredHotelIds.add(room.hotelId);
        }
      });
      filtered = filtered.filter((hotel) => filteredHotelIds.has(hotel.id));
    }
    const selectedRatings = Object.entries(this.ratingFilters)
      .filter(([, value]) => value)
      .map(([key]) => parseInt(key, 10));
    if (selectedRatings.length > 0) {
      filtered = filtered.filter((hotel) =>
        selectedRatings.includes(Math.floor(hotel.rating))
      );
    }
    const selectedPriceRanges = Object.entries(this.priceFilters)
      .filter(([, value]) => value)
      .map(([key]) => key);
    if (selectedPriceRanges.length > 0) {
      filtered = filtered.filter((hotel) => {
        return selectedPriceRanges.some((range) => {
          const [min, max] = range.split('-').map(Number);
          return hotel.price >= min && hotel.price <= max;
        });
      });
    }
    switch (this.sortBy) {
      case 'priceLowToHigh':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'priceHighToLow':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newestFirst':
        filtered.sort((a, b) => b.id - a.id);
        break;
    }
    this.filteredHotelsSubject.next(filtered);
  }
  clearFilters() {
    for (const key in this.roomFilters) {
      this.roomFilters[key] = false;
    }
    for (const key in this.ratingFilters) {
      this.ratingFilters[parseInt(key, 10)] = false;
    }
    for (const key in this.priceFilters) {
      this.priceFilters[key as keyof typeof this.priceFilters] = false;
    }
    this.sortBy = 'priceLowToHigh';
    this.applyFilters();
  }
}
