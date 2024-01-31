import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Language } from './language.model';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private apiUrl =
    'https://de1.api.radio-browser.info/json/languages?hidebroken=true&limit=100&reverse=true&order=stationcount';

  constructor(private http: HttpClient) {}

  getLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching languages:', error);
        throw new Error('Failed to fetch languages. Please try again.');
      })
    );
  }
}
