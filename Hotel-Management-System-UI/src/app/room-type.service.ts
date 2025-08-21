
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoomType } from './room-type.model';

@Injectable({
  providedIn: 'root',
})
export class RoomTypeService {
  private apiUrl = 'http://localhost:8066/api/roomtypes';

  constructor(private http: HttpClient) {}

  getRoomTypes(): Observable<RoomType[]> {
    return this.http.get<RoomType[]>(`${this.apiUrl}/all`);
  }

  // Accepts an object without an ID for a new creation
  addRoomType(roomType: Omit<RoomType, 'id'>): Observable<RoomType> {
    return this.http.post<RoomType>(`${this.apiUrl}/create`, roomType);
  }

  updateRoomType(roomType: RoomType): Observable<RoomType> {
    return this.http.put<RoomType>(`${this.apiUrl}/${roomType.id}`, roomType);
  }

  deleteRoomType(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Delete/${id}`);
  }
}