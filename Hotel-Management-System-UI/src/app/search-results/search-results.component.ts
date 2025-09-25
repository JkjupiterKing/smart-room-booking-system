import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { SearchResultsService, Hotel } from '../search-results.service';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../user.service';
import { AdminService } from '../admin.service';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { HttpErrorResponse } from '@angular/common/http';
import { PublicNavbarComponent } from '../public-navbar/public-navbar.component';
import { AppUserNavbarComponent } from '../app-user-navbar/app-user-navbar.component';
import { RoomService } from '../room.service';
import { Room } from '../room.model';
import { RoomType } from '../room-type.model';
import { RoomTypeService } from '../room-type.service';

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
  allRoomTypes: RoomType[] = [];
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
    private adminService: AdminService,
    private roomService: RoomService,
    private roomTypeService: RoomTypeService
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

      const hotelsObservable = this.hotelIds
        ? this.searchResultsService.fetchHotelsByIds(this.hotelIds)
        : this.searchResultsService.fetchHotelsByCity(
            this.city,
            this.checkIn,
            this.checkOut
          );

      forkJoin({
        hotels: hotelsObservable,
        rooms: this.roomService.getRooms(),
        roomTypes: this.roomTypeService.getRoomTypes(),
      }).subscribe(({ hotels, rooms, roomTypes }) => {
        this.allRoomTypes = roomTypes;
        this.allHotels = this.associateRoomsWithHotels(hotels, rooms, roomTypes);
        this.filteredHotelsSubject.next(this.allHotels);
      });
    });
  }

  associateRoomsWithHotels(
    hotels: Hotel[],
    rooms: Room[],
    roomTypes: RoomType[]
  ): Hotel[] {
    const roomTypeMap = new Map<number, string>();
    roomTypes.forEach((rt) => roomTypeMap.set(rt.id, rt.name));

    const hotelMap = new Map<number, Hotel>();
    hotels.forEach((hotel) => {
      hotel.rooms = [];
      hotelMap.set(hotel.id, hotel);
    });

    rooms.forEach((room) => {
      const hotel = hotelMap.get(room.hotelId);
      if (hotel) {
        const roomTypeName = roomTypeMap.get(room.roomTypeId);
        if (roomTypeName) {
          room.roomType = roomTypeName;
        }
        hotel.rooms?.push(room);
      }
    });

    return Array.from(hotelMap.values());
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
  roomTypeFilters: { [key: string]: boolean } = {};
  ratingFilters: { [key: number]: boolean } = {
    5: false,
    4: false,
    3: false,
  };
  priceFilters = {
    '0-500': false,
    '500-1000': false,
    '1000-2000': false,
    '2000-3000': false,
  };
  sortBy: string = 'priceLowToHigh';

  onRoomTypeFilterChange(roomTypeName: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.roomTypeFilters[roomTypeName] = isChecked;
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

    // Room type filtering
    const selectedRoomTypes = Object.entries(this.roomTypeFilters)
      .filter(([, value]) => value)
      .map(([key]) => key);

    if (selectedRoomTypes.length > 0) {
      filtered = filtered.filter((hotel) =>
        hotel.rooms?.some((room) => selectedRoomTypes.includes(room.roomType))
      );
    }

    // Rating filtering
    const selectedRatings = Object.entries(this.ratingFilters)
      .filter(([, value]) => value)
      .map(([key]) => Number(key));

    if (selectedRatings.length > 0) {
      filtered = filtered.filter((hotel) =>
        selectedRatings.includes(hotel.rating)
      );
    }

    // Price filtering
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
    for (const key in this.roomTypeFilters) {
      this.roomTypeFilters[key] = false;
    }
    for (const key in this.ratingFilters) {
      this.ratingFilters[key as unknown as number] = false;
    }
    for (const key in this.priceFilters) {
      this.priceFilters[key as keyof typeof this.priceFilters] = false;
    }
    this.sortBy = 'priceLowToHigh';
    this.applyFilters();
  }
}
