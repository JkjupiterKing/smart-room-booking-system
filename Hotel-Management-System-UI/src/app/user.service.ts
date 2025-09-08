import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8066/api/users';
  private roomUrl = 'http://localhost:8066/api/bookings';
  private paymentUrl = 'http://localhost:8066/api/payment';

  private loggedIn = false;
  private admin = false;

  constructor(private http: HttpClient) {}

  login() {
    this.loggedIn = true;
  }

  logout() {
    this.loggedIn = false;
    this.admin = false;
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  isAdmin(): boolean {
    return this.admin;
  }

  setAdmin(isAdmin: boolean) {
    this.admin = isAdmin;
  }

  // ✅ Register User (expects { message, user })
  registerUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json' // Changed to json
    }).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  // ✅ Login User
  loginUser(username: string, password: string): Observable<any> {
    const loginData = { username, password };
    return this.http.post(`${this.apiUrl}/login`, loginData, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
    }).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  // ✅ Reserve Room
  reserveRoom(bookingData: any): Observable<any> {
    return this.http.post(`${this.roomUrl}/reserve`, bookingData, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text'
    }).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  // ✅ Process Payment
  processPayment(paymentData: any): Observable<any> {
    return this.http.post(this.paymentUrl, paymentData, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text'
    }).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  // ✅ Update Password
  updatePassword(userId: number, password: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/password/${userId}`, { password }, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text'
    }).pipe(
      catchError((error) => throwError(() => error))
    );
  }
}
