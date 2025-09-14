import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService } from '../hotel/hotel.service';
import { Hotel } from '../search-results.service';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../user.service';
import { AdminService } from '../admin.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PublicNavbarComponent } from '../public-navbar/public-navbar.component';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { latLng, tileLayer, marker, icon, Map } from 'leaflet';
import { AppUserNavbarComponent } from '../app-user-navbar/app-user-navbar.component';
import { RoomService } from '../room.service';
import { Room } from '../room.model';

@Component({
  selector: 'app-hotel-details',
  standalone: true,
  imports: [CommonModule, AdminNavbarComponent, FormsModule, PublicNavbarComponent, LeafletModule, AppUserNavbarComponent],
  templateUrl: './hotel-details.component.html',
  styleUrls: ['./hotel-details.component.css']
})
export class HotelDetailsComponent implements OnInit {
  tileLayer = tileLayer;
  latLng = latLng;
  marker = marker;
  icon = icon;

  map!: Map;
  hotel: Hotel | undefined;
  images: string[] = [];
  selectedImage: string = ''; // Property to hold the main image
  isLoggedIn: boolean = false;
  userRole: string | null = null;
  isLoginModalOpen: boolean = false;
  isRegisterModalOpen: boolean = false;
  registrationSuccess: boolean = false;
  isBookingFlow: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  checkInDate: string = '';
  checkOutDate: string = '';
  adults: number = 1;
  children: number = 0;
  availabilityChecked: boolean = false;
  isAvailable: boolean = false;
  selectedRoomType: Room | null = null;

  user = {
    name: '',
    email: '',
    password: '',
  };
  roomTypes: Room[] = [];

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelService,
    private router: Router,
    private userService: UserService,
    private adminService: AdminService,
    private roomService: RoomService
  ) { }

  onMapReady(map: Map) {
    this.map = map;
    setTimeout(() => {
      this.map.invalidateSize();
    }, 0);
  }

  checkAvailability(): void {
    if (!this.selectedRoomType) {
    alert("⚠️ Please select a room type before booking.");
    return;
  }
    if (!this.hotel) {
      alert('No hotel selected');
      return;
    }

    const request = {
      hotelId: this.hotel.id,
      // roomId: 1, // Assuming a default room ID for now
      checkInDate: this.checkInDate,
      checkOutDate: this.checkOutDate,
      adults: this.adults,
      children: this.children,
      roomType: this.selectedRoomType
    };

    this.roomService.checkAvailability(request).subscribe(response => {
      this.isAvailable = response.available;
      this.availabilityChecked = true;
    });
  }

  bookNow(): void {
    if (!this.hotel) {
      alert('No hotel selected');
      return;
    }

    if (this.isLoggedIn) {
            const city = this.hotel?.location?.city || '';
            const hotelId = this.hotel?.id;
            const checkIn = this.checkInDate;
            const checkOut = this.checkOutDate; 
            const adults = this.adults;
            const children = this.children;
            const roomType = this.selectedRoomType?.roomType;
            console.log('selectedRoomType',this.selectedRoomType?.roomType);
            
            this.router.navigate(['/roombooking'], { queryParams: { hotelId, city, checkIn, checkOut, adults, children,roomType } });

            // this.router.navigate(['/roombooking'], { queryParams: { city, hotelId } });
    } else {
      this.isBookingFlow = true;
      this.openLoginModal();
    }
  }

  ngOnInit(): void {
    this.checkUserStatus();
    const hotelId = this.route.snapshot.paramMap.get('id');
    this.checkInDate = this.route.snapshot.queryParamMap.get('checkIn') || '';
    this.checkOutDate = this.route.snapshot.queryParamMap.get('checkOut') || '';
    if (hotelId) {

      this.roomService.findRoomsByHotelId(Number(hotelId))
  .subscribe((rooms: Room[]) => {
    this.roomTypes = rooms;
  });

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

        if (this.images.length > 0) {
          this.selectedImage = this.images[0]; // Set the first image as the selected one
        }
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

  // Method to change the selected image
  selectImage(image: string): void {
    this.selectedImage = image;
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
      const { username, password } = loginForm.value;

      this.userService.loginUser(username, password).subscribe({
        next: (response) => {
          if (response && response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('role', 'user');
          }
          this.successMessage = 'Login successful!';
          this.closeLoginModal();
          loginForm.reset();

          if (this.isBookingFlow) {
            this.isBookingFlow = false; // Reset the flag
            const city = this.hotel?.location?.city || '';
            const hotelId = this.hotel?.id;
            const checkIn = this.checkInDate;
            const checkOut = this.checkOutDate; 
            const adults = this.adults;
            const children = this.children;
            const roomType = this.selectedRoomType?.roomType;
            console.log('selectedRoomType onLoginSubmit',this.selectedRoomType?.roomType);
            
            this.router.navigate(['/roombooking'], { queryParams: { hotelId, city, checkIn, checkOut, adults, children, roomType } });
          } else {
            this.router
              .navigate(['/landing-page'])
              .then(() => window.location.reload());
          }
        },
        error: (userError: HttpErrorResponse) => {
          this.adminService.loginAdmin(username, password).subscribe({
            next: () => {
              localStorage.setItem('admin', JSON.stringify({ username }));
              localStorage.setItem('role', 'admin');
              this.successMessage = 'Admin login successful!';
              this.closeLoginModal();
              loginForm.reset();

              if (this.isBookingFlow) {
                this.isBookingFlow = false; // Reset the flag, though admins typically don't book
                alert("Admin users cannot book rooms. Redirecting to dashboard.");
                this.router.navigate(['/admin/dashboard']).then(() => window.location.reload());
              } else {
                this.router
                  .navigate(['/admin/dashboard'])
                  .then(() => window.location.reload());
              }
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
