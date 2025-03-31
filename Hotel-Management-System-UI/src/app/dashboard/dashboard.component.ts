import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  selectedLocation: string = '';
  searchQuery: string = '';
  locations: string[] = [
    'Bengaluru',
    'Mysuru',
    'Madikeri',
    'Chikmanglore',
    'Udupi',
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  searchLocation() {
    if (this.selectedLocation) {
      console.log('Searching for locations in:', this.selectedLocation);

      // Navigate to the home page with the selected location
      this.router.navigate(['/roombooking'], {
        queryParams: { location: this.selectedLocation },
      });
    } else {
      alert('Please select a location first!');
    }
  }

}