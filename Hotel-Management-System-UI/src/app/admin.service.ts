import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private adminApiUrl = 'http://localhost:8066/api/admins'; // Admin backend URL

  constructor(private http: HttpClient) { }

  /**
   * Logs in an admin with the provided username and password.
   * Specifies 'text' as the response type.
   * @param username The admin's username.
   * @param password The admin's password.
   * @returns An Observable of the HTTP response (string).
   */
  loginAdmin(username: string, password: string): Observable<string> { // Changed Observable<any> to Observable<string>
    return this.http.post(`${this.adminApiUrl}/login`, 
                          { username, password }, 
                          { responseType: 'text' }); // <-- IMPORTANT: Specify responseType as 'text'
  }
}
