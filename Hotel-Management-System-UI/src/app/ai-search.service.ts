import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiSearchService {
  private apiUrl = 'http://localhost:8066/hotels/ai-search';

  constructor(private http: HttpClient) { }

  search(query: string): Observable<number[]> {
    return this.http.post<number[]>(this.apiUrl, { query });
  }
}
