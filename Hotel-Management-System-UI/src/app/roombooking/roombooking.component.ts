import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
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

@Component({
  selector: 'app-roombooking',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SidebarComponent,
    HttpClientModule
  ],
  templateUrl: './roombooking.component.html',
  styleUrls: ['./roombooking.component.css']
})
export class RoomBookingComponent implements OnInit {
  city: string | null = '';
  rooms: Room[] = [];

  selectedRoom: Room | null = null;
  showModal: boolean = false;
  bookingForm: FormGroup;

  // Change this to hold the fetched data
  amenitiesOptions: Amenity[] = []; 
  mealOptions = ['Meals Included', 'No Meals'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject(UserService) private userService: UserService,
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
    if (this.city) {
      this.fetchHotelsByCity(this.city);
      this.fetchAmenities(); // Call the new function to fetch amenities
    } else {
      alert('Please select a city first');
      this.router.navigate(['/dashboard']);
    }
  }

  fetchHotelsByCity(city: string): void {
    const url = `http://localhost:8066/hotels/city/${city}`;
    this.http.get<Room[]>(url)
      .pipe(
        catchError(error => {
          console.error('Error fetching hotels:', error);
          alert('Failed to fetch hotels. Please try again later.');
          return of([]);
        })
      )
      .subscribe(data => {
        this.rooms = data.map(room => ({
          ...room,
          imageBase64: 'data:image/jpeg;base64,' + room.imageBase64
        }));
      });
  }

  // New function to fetch amenities from the API
  fetchAmenities(): void {
    const url = `http://localhost:8066/api/roomtypes/all`; // Assuming this is your API endpoint
    this.http.get<Amenity[]>(url)
      .pipe(
        catchError(error => {
          console.error('Error fetching amenities:', error);
          // Set a default value or handle the error gracefully
          this.amenitiesOptions = [];
          return of([]);
        })
      )
      .subscribe(data => {
        this.amenitiesOptions = data;
        // Set a default value for the form control
        this.bookingForm.get('amenities')?.setValue(this.amenitiesOptions[0]?.name);
      });
  }

  openBookingModal(room: Room): void {
    this.selectedRoom = room;
    this.showModal = true;
    this.bookingForm.reset({
      adults: 1,
      children: 0,
      meals: 'No Meals',
      // Ensure amenities form control is reset with a valid value
      amenities: this.amenitiesOptions[0]?.name 
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedRoom = null;
  }

  onSubmit(): void {
    if (this.bookingForm.valid && this.selectedRoom) {
      const bookingData = {
        roomTitle: this.selectedRoom.name,
        checkInDate: this.bookingForm.value.checkInDate,
        checkOutDate: this.bookingForm.value.checkOutDate,
        adults: this.bookingForm.value.adults,
        children: this.bookingForm.value.children,
        amenities: this.bookingForm.value.amenities,
        meals: this.bookingForm.value.meals,
        price: this.selectedRoom.price,
      };

      this.router.navigate(['/payment'], { queryParams: bookingData });
    } else {
      alert('Please fill all required fields');
    }
  }

  getStarArray(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }
}