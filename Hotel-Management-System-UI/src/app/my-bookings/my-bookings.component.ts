import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AppUserNavbarComponent } from '../app-user-navbar/app-user-navbar.component';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, AppUserNavbarComponent],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.css'
})
export class MyBookingsComponent implements OnInit {
  bookings: any[] = [];
  private apiUrl = 'http://localhost:8066/api/bookings';
  userId: number | null = null;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        this.userId = user.id;
      }
    }
    this.getAllBookings();
  }

  getAllBookings(): void {
    if (this.userId) {
      this.http.get<any[]>(`${this.apiUrl}/user/${this.userId}`).subscribe({
        next: (data) => {
          this.bookings = data;
          console.log('Bookings for user fetched successfully:', this.bookings);
        },
        error: (error) => {
          console.error('Error fetching user bookings:', error);
        }
      });
    } else {
      console.error('User ID not found, cannot fetch bookings.');
    }
  }

  // Updated deleteBooking method with confirmation alert
  deleteBooking(id: number): void {
    if (confirm('Are you sure you want to delete this booking?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => {
          this.bookings = this.bookings.filter(booking => booking.id !== id);
          console.log(`Booking with ID ${id} deleted successfully.`);
        },
        error: (error) => {
          console.error(`Error deleting booking with ID ${id}:`, error);
        }
      });
    }
  }
}