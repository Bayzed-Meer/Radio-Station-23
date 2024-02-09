import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class StationsService {
  private apiUrl =
    'https://de1.api.radio-browser.info/json/stations/topvote/100';

  constructor(private https: HttpClient) {}

  getStations(): Observable<any[]> {
    return this.https.get<any[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching stations:', error);
        throw new Error('Failed to fetch stations. Please try again.');
      })
    );
  }

  getStationsWithGeolocation(): Observable<any[]> {
    const geoUrl = 'https://de1.api.radio-browser.info/json/stations/search';
    const params = new HttpParams()
      .set('has_geo_info', 'true')
      .set('limit', '500')
      .set('hidebroken', 'true');

    return this.https.get<any[]>(geoUrl, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching stations with geolocation:', error);
        throw new Error(
          'Failed to fetch stations with geolocation. Please try again.'
        );
      })
    );
  }
}
