import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { SidebarComponent } from '../sidebar/sidebar.component';


interface Room {
  id: number;
  title: string;
  image: string;
  price: number;
  description: string;
  amenities: string[];
  occupancy: {
    adults: number;
    children: number;
  };
  rating: number;
}

@Component({
  selector: 'app-roombooking',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SidebarComponent
  ],
  templateUrl: './roombooking.component.html',
  styleUrls: ['./roombooking.component.css']
})
export class RoomBookingComponent implements OnInit {
  city: string | null = '';
  rooms: Room[] = [
    
    {
      id: 1,
      title: 'lake side',
      image: 'data:image/jpeg;base64,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',
      price: 299,
      description: 'Spacious lake side with ocean view',
      amenities: ['Standard Room', 'Deluxe Room', 'Super Deluxe Room', 'Executive Room', 'Suite Room'],
      occupancy: { adults: 2, children: 2 },
      rating: 4.8
    },
    {
      id: 2,
      title: 'Skyline Haven',
      image: 'https://thumbs.dreamstime.com/z/elite-urban-penthouse-stunning-skyline-views-elegant-design-discover-epitome-luxury-living-offering-330225959.jpg',
      price: 199,
      description: 'Modern Skyline Haven with city view',
      amenities: ['Standard Room', 'Deluxe Room', 'Super Deluxe Room', 'Executive Room', 'Suite Room'],
      occupancy: { adults: 2, children: 1 },
      rating: 4.5
    },
    {
      id: 3,
      title: 'Homeward Retreat',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYya33tEefC6jHzr1neBWrx9JhFn_w81C__g&s',
      price: 399,
      description: 'Perfect for family stays with extra space',
      amenities: ['Standard Room', 'Deluxe Room', 'Super Deluxe Room', 'Executive Room', 'Suite Room'],
      occupancy: { adults: 4, children: 2 },
      rating: 4.9
    },
    {
      id: 4,
      title: 'Essence Inn',
      image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/22/a1/9c/80/essentia-luxury-hotel.jpg?w=700&h=-1&s=1',
      price: 149,
      description: 'Essence Inn with essential amenities',
      amenities: ['Standard Room', 'Deluxe Room', 'Super Deluxe Room', 'Executive Room', 'Suite Room'],
      occupancy: { adults: 2, children: 1 },
      rating: 4.3
    },
    {
      id: 5,
      title: 'Infinity Horizons',
      image: 'https://img.freepik.com/premium-photo/26-modern-luxury-resort-perched-cliffside-with-glasswalled-suites-offering-panoramic-views-ocean-infinity-pool-stretches-out-towards-horizon-blending-seamlessly-with_1295806-39951.jpg',
      price: 349,
      description: 'Infinity Horizons with panoramic views',
      amenities: ['Standard Room', 'Deluxe Room', 'Super Deluxe Room', 'Executive Room', 'Suite Room'],
      occupancy: { adults: 2, children: 2 },
      rating: 4.7
    },
    {
      id: 6,
      title: 'The Business Loft',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRX9vQDN7L8-BVw3dOgNCfZTzPKs3Ks1TBdng&s',
      price: 249,
      description: 'Ideal for business travelers',
      amenities: ['Standard Room', 'Deluxe Room', 'Super Deluxe Room', 'Executive Room', 'Suite Room'],
      occupancy: { adults: 2, children: 1 },
      rating: 4.6
    }
  ];


  selectedRoom: Room | null = null;
  showModal: boolean = false;
  bookingForm: FormGroup;

  amenitiesOptions = ['Standard Room', 'Deluxe Room', 'Super Deluxe Room', 'Executive Room', 'Suite Room'];
  mealOptions = ['Meals Included', 'No Meals'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject(UserService) private roomService: UserService,
    private fb: FormBuilder
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
    if (!this.city) {
      alert('Please select a city first');
      this.router.navigate(['/dashboard']);
    }
  }

  openBookingModal(room: Room): void {
    this.selectedRoom = room;
    this.showModal = true;
    this.bookingForm.reset({
      adults: 1,
      children: 0,
      meals: 'No Meals'
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedRoom = null;
  }


  onSubmit(): void {
    if (this.bookingForm.valid && this.selectedRoom) {
      const bookingData = {
        roomTitle: this.selectedRoom.title,
        checkInDate: this.bookingForm.value.checkInDate,
        checkOutDate: this.bookingForm.value.checkOutDate,
        adults: this.bookingForm.value.adults,
        children: this.bookingForm.value.children,
        amenities: this.bookingForm.value.amenities,
        meals: this.bookingForm.value.meals,
        price: this.selectedRoom.price, // Pass the price to the payment page
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