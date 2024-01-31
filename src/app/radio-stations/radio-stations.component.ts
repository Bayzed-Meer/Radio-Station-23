import { Component, OnInit } from '@angular/core';
import { FilterService } from '../filter.service';
import { StationsService } from '../stations.service';

@Component({
  selector: 'app-radio-stations',
  templateUrl: './radio-stations.component.html',
  styleUrls: ['./radio-stations.component.css'],
})
export class RadioStationsComponent implements OnInit {
  likedStatus: Map<string, boolean> = new Map();
  playingStatus: Map<string, boolean> = new Map();
  currentPlayingStation: string | null = null;
  stations: any[] = [];
  filteredStations: any[] = [];

  constructor(
    private stationsService: StationsService,
    private filterService: FilterService
  ) {}

  ngOnInit() {
    this.stationsService.getStations().subscribe(
      (stations) => {
        this.stations = stations.sort((a, b) => b.votes - a.votes);

        this.stations.forEach((station) => {
          this.likedStatus.set(station.stationuuid, false);
          this.playingStatus.set(station.stationuuid, false);
        });

        console.log(this.stations);
        this.filterService.getSelectedFilters().subscribe((filters) => {
          this.applyFilters(filters);
        });
      },
      (error) => {
        console.error('Error fetching stations:', error);
      }
    );
  }

  applyFilters(filters: any) {
    if (!filters.country && !filters.language && !filters.name) {
      // If all filter values are null, show all stations
      this.filteredStations = this.stations;
      return;
    }

    this.filteredStations = this.stations.filter((station) => {
      const countryFilter =
        !filters.country || station.country === filters.country;
      const languageFilter =
        !filters.language || station.language === filters.language;
      const nameFilter = !filters.name || station.name.includes(filters.name);
      console.log(countryFilter);
      return countryFilter && languageFilter && nameFilter;
    });
    console.log(this.filteredStations);
  }

  toggleLike(stationUuid: string) {
    const currentStatus = this.likedStatus.get(stationUuid) || false;
    this.likedStatus.set(stationUuid, !currentStatus);
  }

  togglePlayPause(stationUuid: string) {
    const currentStatus = this.playingStatus.get(stationUuid) || false;

    // Stop the currently playing station if any
    if (
      this.currentPlayingStation &&
      this.currentPlayingStation !== stationUuid
    ) {
      this.playingStatus.set(this.currentPlayingStation, false);
      // Add logic to stop the audio for the currentPlayingStation
    }

    this.playingStatus.set(stationUuid, !currentStatus);

    // Set the currentPlayingStation to the stationUuid if it's playing, otherwise set it to null
    this.currentPlayingStation = this.playingStatus.get(stationUuid)
      ? stationUuid
      : null;

    // Add logic for play/pause functionality (e.g., audio playback control)
    if (this.playingStatus.get(stationUuid)) {
      // Start playing the station
    } else {
      // Pause the station
    }
  }
}
