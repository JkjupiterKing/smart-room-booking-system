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

  fetchHotelsByCity(
    city: string,
    checkIn?: string,
    checkOut?: string
  ): Observable<Hotel[]> {
    this.isLoadingSource.next(true);

    let url = `http://localhost:8066/hotels/city/${city}`;
    const params: string[] = [];

    if (checkIn) {
      params.push(`checkIn=${checkIn}`);
    }
    if (checkOut) {
      params.push(`checkOut=${checkOut}`);
    }

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    return this.http.get<Hotel[]>(url).pipe(
      tap((hotels) => {
        this.hotelsSource.next(hotels);
        this.isLoadingSource.next(false);
      }),
      catchError((error) => {
        console.error('Error fetching hotels:', error);
        this.hotelsSource.next([]);
        this.isLoadingSource.next(false);
        return of([]);
      })
    );
  }
}
