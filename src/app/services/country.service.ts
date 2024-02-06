import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Country } from '../models//country.model';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private apiUrl = 'http://de1.api.radio-browser.info/json/countries';

  constructor(private http: HttpClient) {}

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching countries:', error);
        throw new Error('Failed to fetch countries. Please try again.');
      })
    );
  }
}
