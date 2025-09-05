import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AiSearchService } from '../ai-search.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  selectedCity: string = '';
  locations: any[] = [];
  checkInDate: string = '';
  checkOutDate: string = '';
  guestCount: number = 1;
  aiSearchQuery: string = '';
  today: string = '';
  minCheckoutDate: string = '';

  constructor(private router: Router, private aiSearchService: AiSearchService) {}

  ngOnInit(): void {
    this.fetchLocations();
    this.setTodayDate();
  }

  fetchLocations(): void {
    fetch('http://localhost:8066/api/locations/all')
      .then((res) => res.json())
      .then((data) => {
        this.locations = data;
      })
      .catch((error) => {
        console.error('Error fetching locations:', error);
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

  onSearchHotels(): void {
    if (!this.selectedCity || !this.checkInDate || !this.checkOutDate) {
      alert('Please select a destination, check-in and check-out dates.');
      return;
    }

    this.router.navigate(['/search-results'], {
      queryParams: {
        city: this.selectedCity,
        checkIn: this.checkInDate,
        checkOut: this.checkOutDate,
      },
    });
  }

  onAiSearch(): void {
    if (!this.aiSearchQuery) {
      alert('Please enter a search query.');
      return;
    }

    this.aiSearchService.search(this.aiSearchQuery).subscribe({
      next: (hotelIds) => {
        this.router.navigate(['/search-results'], {
          queryParams: {
            hotelIds: hotelIds.join(','),
          },
        });
      },
      error: (error) => {
        console.error('Error during AI search:', error);
        alert('An error occurred during the AI search. Please try again.');
      },
    });
  }
}
