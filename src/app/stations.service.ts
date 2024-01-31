import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class StationsService {
  private apiUrl =
    'http://de1.api.radio-browser.info/json/stations/topvote/100';

  constructor(private http: HttpClient) {}

  getStations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching stations:', error);
        throw new Error('Failed to fetch stations. Please try again.');
      })
    );
  }
}
