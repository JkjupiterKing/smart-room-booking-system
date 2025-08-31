import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

export interface Location {
  id: number;
  city: string;
  country: string;
}

export interface Hotel {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  imageBase64: string;
  location: Location;
}

@Injectable({
  providedIn: 'root'
})
export class SearchResultsService {
  private hotelsSource = new BehaviorSubject<Hotel[]>([]);
  hotels$ = this.hotelsSource.asObservable();

  private isLoadingSource = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSource.asObservable();

  constructor(private http: HttpClient) { }

  fetchHotelsByCity(city: string): Observable<Hotel[]> {
    this.isLoadingSource.next(true);
    const url = `http://localhost:8066/hotels/city/${city}`;
    return this.http.get<Hotel[]>(url).pipe(
      tap(hotels => {
        const hotelsWithSanitizedImages = hotels.map(hotel => ({
          ...hotel,
          imageBase64: 'data:image/jpeg;base64,' + hotel.imageBase64
        }));
        this.hotelsSource.next(hotelsWithSanitizedImages);
        this.isLoadingSource.next(false);
      }),
      catchError(error => {
        console.error('Error fetching hotels:', error);
        this.hotelsSource.next([]); // Clear previous results on error
        this.isLoadingSource.next(false);
        return of([]); // Return an empty array to continue the stream
      })
    );
  }
}
