import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { HotelService } from '../hotel/hotel.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';

interface Location {
  id: number;
  country: string;
  state?: string;
  city: string;
}

@Component({
  selector: 'app-hotel-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule
  ],
  templateUrl: './hotel-form.component.html',
  styleUrls: ['./hotel-form.component.css']
})
export class HotelFormComponent implements OnInit {
  hotelForm: FormGroup;
  isEditMode: boolean;
  selectedFile: File | null = null;
  selectedFiles: (File | null)[] = [null, null, null, null, null];
  locations: Location[] = [];
  private locationApiUrl = 'http://localhost:8066/api/locations/all'; 

  constructor(
    private fb: FormBuilder,
    private hotelService: HotelService,
    private http: HttpClient,
    public dialogRef: MatDialogRef<HotelFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) {
    this.isEditMode = !!data.hotel;
    this.hotelForm = this.fb.group({
      name: [data.hotel?.name || '', Validators.required],
      location: [data.hotel?.location?.id || '', Validators.required], // store locationId
      price: [data.hotel?.price || '', Validators.required],
      rating: [data.hotel?.rating || '', Validators.required],
      description: [data.hotel?.description || '']
    });
  }

  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations(): void {
    this.http.get<Location[]>(this.locationApiUrl).subscribe({
      next: (res) => (this.locations = res),
      error: (err) => console.error('Error fetching locations', err)
    });
  }

  onFileSelected(event: any, index: number = 0): void {
    const file = event.target.files && event.target.files[0] ? event.target.files[0] : null;
    this.selectedFiles[index] = file;
    if (index === 0) {
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (this.hotelForm.valid) {
      const formData = new FormData();
      const hotelData = this.hotelForm.value;

      // Find the selected location object
      const selectedLocation = this.locations.find(loc => loc.id === hotelData.location);

      const hotelPayload = {
        name: hotelData.name,
        description: hotelData.description,
        price: hotelData.price,
        rating: hotelData.rating,
        location: selectedLocation // ✅ send full object
      };

      formData.append('hotel', new Blob([JSON.stringify(hotelPayload)], { type: 'application/json' }));

      // Append up to 5 optional images. Keys: image, image2, image3, image4, image5
      const keys = ['image', 'image2', 'image3', 'image4', 'image5'];
      for (let i = 0; i < this.selectedFiles.length; i++) {
        const f = this.selectedFiles[i];
        if (f) {
          formData.append(keys[i], f, f.name);
        }
      }

      if (this.isEditMode) {
        this.hotelService.updateHotel(this.data.hotel.id, formData).subscribe(() => {
          this.snackBar.open('Hotel updated successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        }, () => {
          this.snackBar.open('Error updating hotel', 'Close', { duration: 3000 });
        });
      } else {
        this.hotelService.createHotel(formData).subscribe(() => {
          this.snackBar.open('Hotel created successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        }, () => {
          this.snackBar.open('Error creating hotel', 'Close', { duration: 3000 });
        });
      }
    }
  }
}
