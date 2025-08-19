import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { HotelService } from '../hotel/hotel.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-hotel-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule],
  templateUrl: './hotel-form.component.html',
  styleUrls: ['./hotel-form.component.css']
})
export class HotelFormComponent implements OnInit {
  hotelForm: FormGroup;
  isEditMode: boolean;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private hotelService: HotelService,
    public dialogRef: MatDialogRef<HotelFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) {
    this.isEditMode = !!data.hotel;
    this.hotelForm = this.fb.group({
      name: [data.hotel?.name || '', Validators.required],
      location: [data.hotel?.location?.name || '', Validators.required],
      price: [data.hotel?.price || '', Validators.required],
      rating: [data.hotel?.rating || '', Validators.required],
      description: [data.hotel?.description || '']
    });
  }

  ngOnInit(): void {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (this.hotelForm.valid) {
      const formData = new FormData();
      const hotelData = this.hotelForm.value;

      // Create a simplified hotel object for the backend
      const hotelPayload = {
        name: hotelData.name,
        description: hotelData.description,
        price: hotelData.price,
        rating: hotelData.rating,
        location: {
          name: hotelData.location,
          address: 'Default Address', // Add default or fetch from a form
          city: 'Default City'
        }
      };

      formData.append('hotel', new Blob([JSON.stringify(hotelPayload)], { type: 'application/json' }));

      if (this.selectedFile) {
        formData.append('image', this.selectedFile, this.selectedFile.name);
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
