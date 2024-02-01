import { Component, OnInit } from '@angular/core';
import { StationsService } from '../stations.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
})
export class FavoritesComponent implements OnInit {
  favoriteStations: any[] = [];
  likedStatus: Map<string, boolean> = new Map();
  playingStatus: Map<string, boolean> = new Map();

  constructor(private stationsService: StationsService) {}

  ngOnInit() {
    // Retrieve favorite stations from local storage
    const favoritesString = localStorage.getItem('likedStatus');
    this.likedStatus = favoritesString
      ? new Map(JSON.parse(favoritesString))
      : new Map();

    // Initialize playing status for each station
    this.favoriteStations.forEach((station) => {
      this.playingStatus.set(station.stationuuid, false);
    });

    // Fetch all stations from the service
    this.stationsService.getStations().subscribe((stations) => {
      // Filter the stations based on liked status
      this.favoriteStations = stations.filter((station) =>
        this.likedStatus.get(station.stationuuid)
      );
    });
  }

  toggleLike(stationUuid: string) {
    const currentStatus = this.likedStatus.get(stationUuid) || false;
    this.likedStatus.set(stationUuid, !currentStatus);

    // Update favoriteStations array
    this.favoriteStations = this.favoriteStations.filter((station) =>
      this.likedStatus.get(station.stationuuid)
    );

    // Save liked status to local storage
    localStorage.setItem(
      'likedStatus',
      JSON.stringify(Array.from(this.likedStatus.entries()))
    );
  }

  togglePlayPause(stationUuid: string) {
    const currentStatus = this.playingStatus.get(stationUuid) || false;

    // Stop all other stations
    this.favoriteStations.forEach((station) => {
      if (station.stationuuid !== stationUuid) {
        this.playingStatus.set(station.stationuuid, false);
        // Add logic to stop the audio for the station (if applicable)
      }
    });

    // Implement logic for toggling play/pause status as needed
    this.playingStatus.set(stationUuid, !currentStatus);
  }
}
