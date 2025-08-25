import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-management',
  standalone: true,
  imports: [SidebarComponent, CommonModule],
  templateUrl: './booking-management.component.html',
  styleUrl: './booking-management.component.css'
})
export class BookingManagementComponent implements OnInit {
  bookings: any[] = [];
  private apiUrl = 'http://localhost:8066/api/bookings';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAllBookings();
  }

  getAllBookings(): void {
    this.http.get<any[]>(`${this.apiUrl}/all`).subscribe({
      next: (data) => {
        this.bookings = data;
        console.log('Bookings fetched successfully:', this.bookings);
      },
      error: (error) => {
        console.error('Error fetching bookings:', error);
      }
    });
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