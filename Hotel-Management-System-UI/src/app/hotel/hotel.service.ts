import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private apiUrl = 'http://localhost:8080/hotels';

  constructor(private http: HttpClient) { }

  getHotels(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  getHotelById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createHotel(hotel: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, hotel);
  }

  updateHotel(id: number, hotel: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, hotel);
  }

  deleteHotel(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
