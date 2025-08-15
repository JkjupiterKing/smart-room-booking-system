import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';  // <-- import your SidebarComponent

@Component({
  selector: 'app-dashboard',
  standalone: true,                   // <-- make sure this is standalone
  imports: [CommonModule, FormsModule, SidebarComponent],  // <-- add SidebarComponent here
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  selectedLocation: string = '';
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
      this.router.navigate(['/roombooking'], {
        queryParams: { location: this.selectedLocation },
      });
    } else {
      alert('Please select a location first!');
    }
  }
}
