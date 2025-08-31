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

  constructor(
    private router: Router,
    private http: HttpClient,
    private searchResultsService: SearchResultsService
  ) {}

  ngOnInit(): void {
    this.fetchLocations();
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

  searchLocation() {
    if (this.selectedLocation) {
      this.router.navigate(['/search-results'], { queryParams: { city: this.selectedLocation } });
    } else {
      alert('Please select a location first!');
    }
  }
}
