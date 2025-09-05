import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import ReactiveFormsModule and form related classes

interface Location {
  id?: number;
  city: string;
  country: string;
}

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule], // Add ReactiveFormsModule here
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  locations: Location[] = [];
  modalOpen = false;
  isEditing = false;
  currentLocationId: number | null = null;
  locationForm: FormGroup; // Declare locationForm as FormGroup
  apiUrl = 'http://localhost:8066/api/locations';

  constructor(private http: HttpClient, private fb: FormBuilder) { // Inject FormBuilder
    // Initialize the form group with validators
    this.locationForm = this.fb.group({
      city: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

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
    this.locationForm.reset(); // Reset the form when opening for adding
    this.modalOpen = true;
  }

  openEditModal(location: Location) {
    this.isEditing = true;
    this.currentLocationId = location.id || null;
    // Populate the form with the selected location's data
    this.locationForm.patchValue({
      city: location.city,
      country: location.country
    });
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.locationForm.reset(); // Reset form when closing modal
  }

  saveLocation() {
    // Check if the form is valid before proceeding
    if (this.locationForm.invalid) {
      this.locationForm.markAllAsTouched(); // Mark all fields as touched to display validation messages
      return; // Stop execution if form is invalid
    }

    const locationData: Location = this.locationForm.value; // Get form values

    if (this.isEditing && this.currentLocationId) {
      // Update existing location
      this.http.put<Location>(`${this.apiUrl}/update/${this.currentLocationId}`, locationData)
        .subscribe({
          next: () => {
            this.fetchLocations();
            this.closeModal();
          },
          error: err => console.error('Error updating location', err)
        });
    } else {
      // Create new location
      this.http.post<Location>(`${this.apiUrl}/create`, locationData)
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

