import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  createBooking(bookingData: any) {
    throw new Error('Method not implemented.');
  }

  private apiUrl = 'http://localhost:8066/api/users';
  private roomUrl = 'http://localhost:8066/api/bookings';
  private paymentUrl = 'http://localhost:8066/api/payment';
  baseUrl: any;
  

  constructor(private http: HttpClient) {}


  registerUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text'  // Add this since your backend returns a String
    }).pipe(
      catchError((error) => {
        // Preserve the original error
        return throwError(() => error);
      })
    );
  }


  loginUser(username: string, password: string): Observable<any> {
    const loginData = {
      username: username,
      password: password
    };
    
    return this.http.post(`${this.apiUrl}/login`, loginData, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text'  // Since your backend returns a String
    }).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

 
  
reserveRoom(bookingData: any): Observable<any> {
  return this.http.post('http://localhost:8066/api/bookings/reserve', bookingData, {
    headers: { 'Content-Type': 'application/json' },
    responseType: 'text'  // This ensures we expect a plain text response
  }).pipe(
    catchError((error) => {
      return throwError(() => error);
    })
  );
}

// ✅ Process Payment and Connect to Backend
processPayment(paymentData: any): Observable<any> {
  console.log("Payment details in service");
  return this.http.post(`http://localhost:8066/api/payment`, paymentData, {
    headers: { 'Content-Type': 'application/json' },
    responseType: 'text'  // Expecting a success message
  }).pipe(
    catchError((error) => throwError(() => error))
  );
}

}