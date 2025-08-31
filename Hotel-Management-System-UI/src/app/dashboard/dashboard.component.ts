import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SearchResultsService } from '../search-results.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  selectedLocation: string = '';
  locations: string[] = [];  // Will hold list of city names
  checkInDate: string = '';
  checkOutDate: string = '';
  today: string = '';
  minCheckoutDate: string = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private searchResultsService: SearchResultsService
  ) {}

  ngOnInit(): void {
    this.fetchLocations();
    this.setTodayDate();
  }

  fetchLocations(): void {
    this.http.get<{ id: number, country: string | null, city: string }[]>(
      'http://localhost:8066/api/locations/all'
    ).subscribe({
      next: (data) => {
        // Map API response to extract only city names
        this.locations = data
          .map(item => item.city)
          .filter(city => !!city); // Filter out null/undefined
      },
      error: (err) => {
        console.error('Failed to fetch cities:', err);
        alert('Could not load city list. Please try again later.');
      }
    });
  }

  setTodayDate(): void {
    const todayDate = new Date();
    this.today = todayDate.toISOString().split('T')[0];
    this.minCheckoutDate = this.today;
  }

  updateMinCheckoutDate(): void {
    if (this.checkInDate) {
      const checkIn = new Date(this.checkInDate);
      const nextDay = new Date(checkIn);
      nextDay.setDate(checkIn.getDate() + 1);
      this.minCheckoutDate = nextDay.toISOString().split('T')[0];

      if (this.checkOutDate && this.checkOutDate <= this.checkInDate) {
        this.checkOutDate = '';
      }
    }
  }

  searchLocation() {
    if (this.selectedLocation) {
      this.router.navigate(['/search-results'], {
        queryParams: {
          city: this.selectedLocation,
          checkIn: this.checkInDate,
          checkOut: this.checkOutDate,
        },
      });
    } else {
      alert('Please select a location first!');
    }
  }
}
