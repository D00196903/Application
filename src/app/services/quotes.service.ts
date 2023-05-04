import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuotesService {
  private readonly apiURL = 'https://api.quotable.io/random';

  constructor(private http: HttpClient) { } // <-- HttpClient should be recognized here

  getRandomQuote(): Observable<any> {
    return this.http.get<any>(this.apiURL);
  }
}