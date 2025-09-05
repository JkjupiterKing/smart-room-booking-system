import { Hotel } from './hotel/hotel.model';

export interface Room {
  roomId?: number;
  hotel: Hotel | null;
  roomType: string;
  capacity: number;
  pricePerNight: number;
  totalRooms: number;
}
