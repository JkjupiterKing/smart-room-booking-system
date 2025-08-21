import { Component, OnInit } from '@angular/core';
import { RoomTypeService } from '../room-type.service';
import { RoomType } from '../room-type.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-room-type-management',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './room-type-management.component.html',
  styleUrls: ['./room-type-management.component.css'],
})
export class RoomTypeManagementComponent implements OnInit {
  roomTypes: RoomType[] = [];
  selectedRoomType: RoomType = { name: '', description: '' };
  showAddRoomTypeModal: boolean = false;

  constructor(private roomTypeService: RoomTypeService) {}

  ngOnInit(): void {
    this.loadRoomTypes();
  }

  loadRoomTypes(): void {
    this.roomTypeService.getRoomTypes().subscribe(
      (data) => {
        this.roomTypes = data;
      },
      (error) => {
        console.error('Error loading room types:', error);
      }
    );
  }

  saveRoomType(): void {
    if (!this.selectedRoomType.name || !this.selectedRoomType.description) {
      alert('Please fill in both name and description for the room type.');
      return;
    }

    if (this.selectedRoomType.id) {
      this.roomTypeService.updateRoomType(this.selectedRoomType).subscribe(
        () => {
          this.loadRoomTypes();
          this.resetFormAndHide();
        },
        (error) => {
          console.error('Error updating room type:', error);
        }
      );
    } else {
      // Create a new object without the 'id' property
      const newRoomTypeWithoutId = {
        name: this.selectedRoomType.name,
        description: this.selectedRoomType.description,
      };

      this.roomTypeService.addRoomType(newRoomTypeWithoutId).subscribe(
        () => {
          this.loadRoomTypes();
          this.resetFormAndHide();
        },
        (error) => {
          console.error('Error adding room type:', error);
        }
      );
    }
  }

  editRoomType(roomType: RoomType): void {
    this.selectedRoomType = { ...roomType };
    this.showAddRoomTypeModal = true;
  }

  showAddForm(): void {
    this.selectedRoomType = { name: '', description: '' };
    this.showAddRoomTypeModal = true;
  }

  resetFormAndHide(): void {
    this.selectedRoomType = { name: '', description: '' };
    this.showAddRoomTypeModal = false;
  }

  deleteRoomType(id: number): void {
    if (confirm('Are you sure you want to delete this room type?')) {
      this.roomTypeService.deleteRoomType(id).subscribe(
        () => {
          this.loadRoomTypes();
        },
        (error) => {
          console.error('Error deleting room type:', error);
        }
      );
    }
  }
}