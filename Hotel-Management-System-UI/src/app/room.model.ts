import { Hotel } from './hotel/hotel.model';

export interface Room {
  roomId?: number;
  hotelId: number;
  hotelName: string;
  roomType: string;
  capacity: number;
  pricePerNight: number;
  totalRooms: number;
}
