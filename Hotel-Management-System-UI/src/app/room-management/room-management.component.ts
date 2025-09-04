import { Component, OnInit } from '@angular/core';
import { RoomService } from '../room.service';
import { Room } from '../room.model';
import { Hotel } from '../hotel/hotel.model';
import { RoomType } from '../room-type.model';
import { HotelService } from '../hotel/hotel.service';
import { RoomTypeService } from '../room-type.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-room-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './room-management.component.html',
  styleUrls: ['./room-management.component.css']
})
export class RoomManagementComponent implements OnInit {
  rooms: Room[] = [];
  hotels: Hotel[] = [];
  roomTypes: RoomType[] = [];
  selectedRoom: Room = {
    hotel: null,
    roomType: '',
    capacity: 0,
    pricePerNight: 0,
    totalRooms: 0
  };
  showAddRoomModal = false;

  constructor(
    private roomService: RoomService,
    private hotelService: HotelService,
    private roomTypeService: RoomTypeService
  ) { }

  ngOnInit(): void {
    this.loadRooms();
    this.loadHotels();
    this.loadRoomTypes();
  }

  loadRooms(): void {
    this.roomService.getRooms().subscribe(data => {
      this.rooms = data;
    });
  }

  loadHotels(): void {
    this.hotelService.getHotels().subscribe(data => {
      this.hotels = data;
    });
  }

  loadRoomTypes(): void {
    this.roomTypeService.getRoomTypes().subscribe(data => {
      this.roomTypes = data;
    });
  }

  saveRoom(): void {
    if (this.selectedRoom.roomId) {
      this.roomService.updateRoom(this.selectedRoom).subscribe(() => {
        this.loadRooms();
        this.resetFormAndHide();
      });
    } else {
      this.roomService.addRoom(this.selectedRoom).subscribe(() => {
        this.loadRooms();
        this.resetFormAndHide();
      });
    }
  }

  editRoom(room: Room): void {
    this.selectedRoom = { ...room };
    this.showAddRoomModal = true;
  }

  showAddForm(): void {
    this.selectedRoom = {
      hotel: null,
      roomType: '',
      capacity: 0,
      pricePerNight: 0,
      totalRooms: 0
    };
    this.showAddRoomModal = true;
  }

  resetFormAndHide(): void {
    this.selectedRoom = {
      hotel: null,
      roomType: '',
      capacity: 0,
      pricePerNight: 0,
      totalRooms: 0
    };
    this.showAddRoomModal = false;
  }

  deleteRoom(id: number): void {
    if (confirm('Are you sure you want to delete this room?')) {
      this.roomService.deleteRoom(id).subscribe(() => {
        this.loadRooms();
      });
    }
  }
}
