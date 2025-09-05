import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import Chart from 'chart.js/auto';

interface User {
  id: number;
  username: string;
  email: string;
}

interface Booking {
  id: number;
  roomTitle: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  amenities: string;
  meals: string;
  status: string;
  totalPrice: number;
  notes: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('bookingChartCanvas') bookingChartCanvas!: ElementRef;
  userCount: number = 0;
  bookingCount: number = 0;
  private apiUrl = 'http://localhost:8066/api';

  public chart: any;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.fetchUserCount();
    this.fetchBookingCount();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.createBookingChart();
    }
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
    const monthlyBookingsData = [12, 19, 3, 5, 2, 3, 15, 20, 10, 8, 14, 17];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    this.chart = new Chart(this.bookingChartCanvas.nativeElement, {
      type: 'bar',
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
        maintainAspectRatio: false,
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
