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
  currentPlayingStationInfo: any = null;
  playPauseIcon: string = 'play_arrow'; // Added variable for play/pause icon
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

        this.filterService.getSelectedFilters().subscribe((filters) => {
          this.applyFilters(filters);
        });

        // Set initial play/pause icon state
        this.updatePlayPauseIcon();
      },
      (error) => {
        console.error('Error fetching stations:', error);
      }
    );
  }

  applyFilters(filters: any) {
    if (!filters.country && !filters.language && !filters.name) {
      this.filteredStations = this.stations;
      return;
    }
    this.filteredStations = this.stations.filter((station) => {
      const countryFilter =
        !filters.country ||
        station.country.toLowerCase() === filters.country.toLowerCase();

      const languageFilter =
        !filters.language ||
        station.language
          .toLowerCase()
          .split(' ')
          .some((word: string) =>
            filters.language.toLowerCase().includes(word)
          );

      const nameFilter =
        !filters.name ||
        station.name.toLowerCase().includes(filters.name.toLowerCase());
      return countryFilter && languageFilter && nameFilter;
    });
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
    this.currentPlayingStation = this.playingStatus.get(stationUuid)
      ? stationUuid
      : null;

    // Update the play/pause icon in the footer
    this.updatePlayPauseIcon();

    // Add logic for play/pause functionality (e.g., audio playback control)
    if (this.playingStatus.get(stationUuid)) {
      // Start playing the station
    } else {
      // Pause the station
    }
  }

  updatePlayPauseIcon() {
    if (this.currentPlayingStation) {
      this.playPauseIcon = this.playingStatus.get(this.currentPlayingStation)
        ? 'pause'
        : 'play_arrow';
      this.currentPlayingStationInfo = this.stations.find(
        (station) => station.stationuuid === this.currentPlayingStation
      );
    } else {
      this.playPauseIcon = 'play_arrow';
      this.currentPlayingStationInfo = null;
    }
  }
}
