import { Component, OnInit } from '@angular/core';
import { HotelService } from '../hotel/hotel.service';
import { MatDialog } from '@angular/material/dialog';
import { HotelFormComponent } from '../hotel-form/hotel-form.component';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Import this for a loading spinner

interface Hotel {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  imageBase64: string;
  location: {
    id: number;
    city: string;
  };
}

@Component({
  selector: 'app-hotel-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    SidebarComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './hotel-management.component.html',
  styleUrls: ['./hotel-management.component.css'],
})
export class HotelManagementComponent implements OnInit {
  hotels: Hotel[] = []; // Store the original, unfiltered list
  filteredHotels: Hotel[] = []; // The list to be displayed
  cities: string[] = []; // Holds the list of unique cities
  selectedCity: string | null = 'All'; // Tracks the currently selected city for active state

  constructor(
    private hotelService: HotelService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadHotels();
  }

  loadHotels(): void {
    this.hotelService.getHotels().subscribe(
      (data: Hotel[]) => {
        this.hotels = data;
        this.extractCities();
        this.filterByCity('All'); // Show all hotels by default
      },
      (error) => {
        console.error('Error fetching hotels:', error);
        this.snackBar.open('Error fetching hotels', 'Close', {
          duration: 3000,
        });
      }
    );
  }

  // Method to extract unique city names
  private extractCities(): void {
    const citySet = new Set<string>();
    this.hotels.forEach((hotel) => {
      if (hotel.location && hotel.location.city) {
        citySet.add(hotel.location.city);
      }
    });
    this.cities = ['All', ...Array.from(citySet)];
  }

  // Method to filter hotels by city
  filterByCity(city: string): void {
    this.selectedCity = city;
    if (city === 'All') {
      this.filteredHotels = this.hotels;
    } else {
      this.filteredHotels = this.hotels.filter(
        (hotel) => hotel.location?.city === city
      );
    }
  }

  openAddHotelDialog(): void {
    const dialogRef = this.dialog.open(HotelFormComponent, {
      width: '400px',
      data: { hotel: null },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadHotels();
      }
    });
  }

  openEditHotelDialog(hotel: any): void {
    const dialogRef = this.dialog.open(HotelFormComponent, {
      width: '400px',
      data: { hotel: hotel },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadHotels();
      }
    });
  }

  deleteHotel(id: number): void {
    if (confirm('Are you sure you want to delete this hotel?')) {
      this.hotelService.deleteHotel(id).subscribe(
        () => {
          this.loadHotels();
          this.snackBar.open('Hotel deleted successfully', 'Close', {
            duration: 3000,
          });
        },
        (error) => {
          console.error('Error deleting hotel:', error);
          this.snackBar.open('Error deleting hotel', 'Close', {
            duration: 3000,
          });
        }
      );
    }
  }
}