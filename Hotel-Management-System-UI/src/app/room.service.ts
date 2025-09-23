import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from './room.model';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = 'http://localhost:8066/api/rooms';

  constructor(private http: HttpClient) { }

  checkAvailability(request: any): Observable<{ available: boolean }> {
    return this.http.post<{ available: boolean }>(`${this.apiUrl}/check-availability`, request);
  }

  checkAvailabilityV2(checkInDate: string, checkOutDate: string): Observable<any[]> {
    const options = {
      headers: { 'Content-Type': 'application/json' },
      body: {
        checkInDate,
        checkOutDate
      }
    };
    return this.http.request<any[]>('POST', `${this.apiUrl}/check-availability`, options);
  }
  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/all`);
  }

  getRoom(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/${id}`);
  }

  addRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(this.apiUrl, room);
  }

  updateRoom(room: Room): Observable<Room> {
    return this.http.put<Room>(`${this.apiUrl}/${room.roomId}`, room);
  }

  deleteRoom(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
    findRoomsByHotelId(hotelId: number): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/findRoomsByHotelId?hotelId=${hotelId}`);
  }

}
