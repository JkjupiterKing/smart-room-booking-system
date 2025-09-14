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
  checkInDate: string = '';
  checkOutDate: string = ''
  adults: number = 1;
  children: number = 0
  roomType: string = '';
  hotelId: number | null = null;

  selectedRoom: Room | null = null;
  showModal: boolean = false;
  bookingForm!: FormGroup;



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
 
  }

  ngOnInit(): void {
    this.city = this.route.snapshot.queryParamMap.get('location');
    this.hotelId = Number(this.route.snapshot.queryParamMap.get('hotelId'));
    this.checkInDate = this.route.snapshot.queryParamMap.get('checkIn') || '';
    this.checkOutDate = this.route.snapshot.queryParamMap.get('checkOut') || '';
    this.adults = Number(this.route.snapshot.queryParamMap.get('adults')) || 1;
    this.children = Number(this.route.snapshot.queryParamMap.get('children')) || 0;
    this.roomType = this.route.snapshot.queryParamMap.get('roomType') || '';




        this.hotelService.getHotelById(this.hotelId).subscribe(hotel => {
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
      
      this.bookingForm = this.fb.group({
    checkInDate: [{ value: this.checkInDate, disabled: !!this.checkInDate }, Validators.required],
    checkOutDate: [{ value: this.checkOutDate, disabled: !!this.checkOutDate }, Validators.required],
    adults: [{ value: this.adults, disabled: !!this.adults }, [Validators.required, Validators.min(1)]],
    children: [{ value: this.children, disabled: true }, [Validators.required, Validators.min(0)]],
    roomType: [{ value: this.roomType, disabled: !!this.roomType }, Validators.required],
    meals: ['No Meals', Validators.required],
  });

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    this.minCheckInDate = this.formatDate(tomorrow);
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
      adults: this.adults,
      children: this.children,
      checkInDate: this.checkInDate,
      checkOutDate: this.checkOutDate,
      meals: 'No Meals',
      roomType: this.roomType
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
      console.log(this.bookingForm.value.checkInDate);
      const rawFormValues = this.bookingForm.getRawValue();

      const bookingData = {
        user: { id: userId },
        checkInDate: rawFormValues.checkInDate,
        checkOutDate: rawFormValues.checkOutDate,
        adults: rawFormValues.adults,
        children: rawFormValues.children,
        roomType: rawFormValues.roomType,
        meals: rawFormValues.meals,
        price: this.selectedRoom.price,
        hotelId: this.selectedRoom.id,
        hotelName: this.selectedRoom.name
      };
      console.log('Booking Data before navigation:', bookingData);
  this.router.navigate(['/payment'], { state: { booking: bookingData } });
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