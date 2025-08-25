import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Import HttpClient and HttpClientModule
import { CommonModule } from '@angular/common'; // Import CommonModule
import Chart from 'chart.js/auto'; // Import Chart.js

interface User {
  id: number;
  username: string;
  email: string;
  // Add other user properties as needed
}

interface Booking {
  id: number;
  roomTitle: string;
  checkInDate: string; // Assuming date as string from backend
  checkOutDate: string;
  adults: number;
  children: number;
  amenities: string;
  meals: string;
  status: string;
  totalPrice: number;
  notes: string;
  // user: User; // If you need user details within booking
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true, // Marking the component as standalone
  imports: [SidebarComponent, CommonModule, HttpClientModule], // Add CommonModule and HttpClientModule here
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('bookingChartCanvas') bookingChartCanvas!: ElementRef;
  userCount: number = 0;
  bookingCount: number = 0;
  private apiUrl = 'http://localhost:8066/api'; // Base URL for your backend

  public chart: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUserCount();
    this.fetchBookingCount();
  }

  ngAfterViewInit(): void {
    this.createBookingChart();
  }

  fetchUserCount(): void {
    this.http.get<User[]>(`${this.apiUrl}/users/all`).subscribe({
      next: (users) => {
        this.userCount = users.length;
        console.log('Total users:', this.userCount);
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  fetchBookingCount(): void {
    this.http.get<Booking[]>(`${this.apiUrl}/bookings/all`).subscribe({
      next: (bookings) => {
        this.bookingCount = bookings.length;
        console.log('Total bookings:', this.bookingCount);
      },
      error: (error) => {
        console.error('Error fetching bookings:', error);
      }
    });
  }
  
  createBookingChart(): void {
    // Mock data for analytics - in a real app, this would come from an API
    const monthlyBookingsData = [12, 19, 3, 5, 2, 3, 15, 20, 10, 8, 14, 17]; // Example data for 12 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    this.chart = new Chart(this.bookingChartCanvas.nativeElement, {
      type: 'bar', // Type of chart
      data: {
        labels: months,
        datasets: [{
          label: 'Bookings per Month',
          data: monthlyBookingsData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Allows chart to fill its container
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Bookings'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Month'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Monthly Booking Overview'
          }
        }
      }
    });
  }
}
