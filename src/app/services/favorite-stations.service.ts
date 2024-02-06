import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FavoriteStationsService {
  getFavoriteStations(): string[] {
    return JSON.parse(localStorage.getItem('favoriteStations') || '[]');
  }

  isStationFavorite(stationUuid: string): boolean {
    const favoriteStations = this.getFavoriteStations();
    return favoriteStations.includes(stationUuid);
  }

  addToFavoriteStations(stationUuid: string): void {
    const favoriteStations = this.getFavoriteStations();
    favoriteStations.push(stationUuid);
    this.updateLocalStorage(favoriteStations);
  }

  removeFromFavoriteStations(stationUuid: string): void {
    let favoriteStations = this.getFavoriteStations();
    favoriteStations = favoriteStations.filter((id) => id !== stationUuid);
    this.updateLocalStorage(favoriteStations);
  }

  private updateLocalStorage(favoriteStations: string[]): void {
    localStorage.setItem('favoriteStations', JSON.stringify(favoriteStations));
  }
}
