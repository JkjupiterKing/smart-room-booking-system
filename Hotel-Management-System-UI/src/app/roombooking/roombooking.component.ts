import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { HotelService } from '../hotel/hotel.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface Location {
  id: number;
  city: string;
  country: string;
}

interface Room {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  imageBase64: string;
  location: Location;
}

interface Amenity {
  id: number;
  name: string;
  description: string;
}

import { AppUserNavbarComponent } from '../app-user-navbar/app-user-navbar.component';

@Component({
  selector: 'app-roombooking',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    AppUserNavbarComponent
  ],
  templateUrl: './roombooking.component.html',
  styleUrls: ['./roombooking.component.css']
})
export class RoomBookingComponent implements OnInit {
  city: string | null = '';

  selectedRoom: Room | null = null;
  showModal: boolean = false;
  bookingForm: FormGroup;

  amenitiesOptions: Amenity[] = [];
  mealOptions = ['Meals Included', 'No Meals'];

  // Date constraints
  minCheckInDate: string = '';
  minCheckOutDate: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject(UserService) private userService: UserService,
  private hotelService: HotelService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.bookingForm = this.fb.group({
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      adults: [1, [Validators.required, Validators.min(1)]],
      children: [0, [Validators.required, Validators.min(0)]],
      amenities: ['', Validators.required],
      meals: ['No Meals', Validators.required]
    });
  }

  ngOnInit(): void {
    this.city = this.route.snapshot.queryParamMap.get('location');
    const hotelIdParam = this.route.snapshot.queryParamMap.get('hotelId');

    if (hotelIdParam) {
      const hotelId = Number(hotelIdParam);
      if (!isNaN(hotelId)) {
        this.hotelService.getHotelById(hotelId).subscribe(hotel => {
          // Map fetched hotel to Room shape (Room and Hotel have similar fields)
          this.selectedRoom = {
            id: hotel.id,
            name: hotel.name,
            description: hotel.description,
            price: hotel.price,
            rating: hotel.rating,
            imageBase64: hotel.imageBase64,
            location: hotel.location
          };

          // Pre-open modal so user can book this specific hotel/room
          this.openBookingModal(this.selectedRoom);
        }, err => {
          console.error('Failed to fetch hotel by id', err);
        });
      }
    }

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    this.minCheckInDate = this.formatDate(tomorrow);

    if (this.city) {
      this.fetchAmenities();
    } else {
      alert('Please select a city first');
      this.router.navigate(['/dashboard']);
    }
  }

  fetchAmenities(): void {
    const url = `http://localhost:8066/api/roomtypes/all`;
    this.http.get<Amenity[]>(url)
      .pipe(
        catchError(error => {
          console.error('Error fetching amenities:', error);
          this.amenitiesOptions = [];
          return of([]);
        })
      )
      .subscribe(data => {
        this.amenitiesOptions = data;
        this.bookingForm.get('amenities')?.setValue(this.amenitiesOptions[0]?.name);
      });
  }

  openBookingModal(room: Room): void {
    this.selectedRoom = room;
    this.showModal = true;

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    this.minCheckInDate = this.formatDate(tomorrow);
    this.minCheckOutDate = ''; // reset checkout date

    this.bookingForm.reset({
      adults: 1,
      children: 0,
      meals: 'No Meals',
      amenities: this.amenitiesOptions[0]?.name
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedRoom = null;
  }

  onSubmit(): void {
    if (this.bookingForm.valid && this.selectedRoom) {
      const userString = localStorage.getItem('user');
      let userId: number | null = null;
      if (userString) {
        try {
          const user = JSON.parse(userString);
          userId = user.id;
        } catch (e) {
          console.error('Failed to parse user data from local storage', e);
        }
      }

      if (userId === null) {
        alert('User is not logged in. Please log in to book a room.');
        this.router.navigate(['/login']);
        return;
      }
      
      const bookingData = {
        user: { id: userId }, // Send the userId in a nested user object
        roomTitle: this.selectedRoom.name,
        checkInDate: this.bookingForm.value.checkInDate,
        checkOutDate: this.bookingForm.value.checkOutDate,
        adults: this.bookingForm.value.adults,
        children: this.bookingForm.value.children,
        amenities: this.bookingForm.value.amenities,
        meals: this.bookingForm.value.meals,
        price: this.selectedRoom.price,
      };

  this.router.navigate(['/user/payment'], { state: { booking: bookingData } });
    } else {
      alert('Please fill all required fields');
    }
  }

  onCheckInDateChange(): void {
    const checkInValue = this.bookingForm.get('checkInDate')?.value;
    if (checkInValue) {
      const checkInDate = new Date(checkInValue);
      const nextDay = new Date(checkInDate);
      nextDay.setDate(checkInDate.getDate() + 1);
      this.minCheckOutDate = this.formatDate(nextDay);

      const checkOutControl = this.bookingForm.get('checkOutDate');
      if (checkOutControl?.value && new Date(checkOutControl.value) <= checkInDate) {
        checkOutControl.setValue('');
      }
    }
  }

  getStarArray(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}