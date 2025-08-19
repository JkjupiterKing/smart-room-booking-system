import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';

interface Location {
  id?: number;
  name: string;
  address: string;
  city: string;
}

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  locations: Location[] = [];
  modalOpen = false;
  isEditing = false;
  currentLocation: Location = { name: '', address: '', city: '' };
  apiUrl = 'http://localhost:8080/api/locations';  // Change this to your API base URL

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchLocations();
  }

  fetchLocations() {
    this.http.get<Location[]>(`${this.apiUrl}/all`).subscribe({
      next: data => this.locations = data,
      error: err => console.error('Error fetching locations', err)
    });
  }

  openAddModal() {
    this.isEditing = false;
    this.currentLocation = { name: '', address: '', city: '' };
    this.modalOpen = true;
  }

  openEditModal(location: Location) {
    this.isEditing = true;
    this.currentLocation = { ...location };
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
  }

  saveLocation() {
    if (this.isEditing && this.currentLocation.id) {
      // Update existing location
      this.http.put<Location>(`${this.apiUrl}/update/${this.currentLocation.id}`, this.currentLocation)
        .subscribe({
          next: () => {
            this.fetchLocations();
            this.closeModal();
          },
          error: err => console.error('Error updating location', err)
        });
    } else {
      // Create new location
      this.http.post<Location>(`${this.apiUrl}/create`, this.currentLocation)
        .subscribe({
          next: () => {
            this.fetchLocations();
            this.closeModal();
          },
          error: err => console.error('Error creating location', err)
        });
    }
  }

  deleteLocation(id: number | undefined) {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this location?')) return;

    this.http.delete(`${this.apiUrl}/delete/${id}`).subscribe({
      next: () => this.fetchLocations(),
      error: err => console.error('Error deleting location', err)
    });
  }
}
