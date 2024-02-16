import { Component, OnInit } from '@angular/core';
import { FavoriteStationsService } from '../../services/favorite-stations.service';
import { FilterService } from '../../services/filter.service';
import { StationsService } from '../../services/stations.service';

@Component({
  selector: 'app-radio-stations',
  templateUrl: './radio-stations.component.html',
  styleUrls: ['./radio-stations.component.scss'],
})
export class RadioStationsComponent implements OnInit {
  currentPlayingStation: string | null = null;
  currentPlayingStationInfo: any = null;
  playPauseIcon: string = 'play_arrow';
  stations: any[] = [];
  filteredStations: any[] = [];
  timerDuration: number | null = null;
  isTimerActive: boolean = false;
  timerInterval: any;
  constructor(
    private stationsService: StationsService,
    private filterService: FilterService,
    private favoriteStationsService: FavoriteStationsService
  ) {}

  ngOnInit() {
    this.stationsService.getStations().subscribe(
      (stations) => {
        this.stations = stations.sort((a, b) => b.votes - a.votes);

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

  toggleFavorite(stationUuid: any): void {
    if (this.favoriteStationsService.isStationFavorite(stationUuid)) {
      this.favoriteStationsService.removeFromFavoriteStations(stationUuid);
    } else {
      this.favoriteStationsService.addToFavoriteStations(stationUuid);
    }
  }

  isStationFavorite(stationUuid: string): boolean {
    return this.favoriteStationsService.isStationFavorite(stationUuid);
  }

  togglePlayPause(station: any): void {
    const stationUuid = station.stationuuid;
    const stationUrl = station.url_resolved;
    if (stationUuid === this.currentPlayingStation) {
      this.pauseAudio();
    } else {
      if (this.currentPlayingStation !== null) this.pauseAudio();
      this.currentPlayingStationInfo = station;
      this.currentPlayingStation = stationUuid;
      this.playAudio(stationUrl);
    }
  }

  playAudio(url: string): void {
    const audioElement = this.getAudioElement();
    audioElement!.src = url;
    audioElement!.play();
    this.updatePlayPauseIcon();
  }

  pauseAudio(): void {
    const audioElement = this.getAudioElement();

    audioElement!.pause();
    this.currentPlayingStation = null;
    this.updatePlayPauseIcon();
  }

  updatePlayPauseIcon(): void {
    this.playPauseIcon =
      this.playPauseIcon === 'play_arrow' ? 'pause' : 'play_arrow';
  }

  openTimerDialog(): void {
    const userInput = prompt('Enter timer duration (in seconds):');
    const parsedDuration = userInput ? parseInt(userInput, 10) : null;

    if (
      parsedDuration !== null &&
      !isNaN(parsedDuration) &&
      parsedDuration > 0
    ) {
      this.timerDuration = parsedDuration;
      this.startTimer();
    } else {
      alert(
        'Invalid input for timer duration. Please enter a valid positive number.'
      );
    }
  }

  startTimer(): void {
    if (!this.isTimerActive && this.timerDuration !== null) {
      this.isTimerActive = true;
      this.timerInterval = setInterval(() => {
        this.timerDuration = (this.timerDuration ?? 0) - 1;

        if (this.timerDuration <= 0) {
          this.stopTimer();
        }
      }, 1000);
    }
  }

  stopTimer(): void {
    clearInterval(this.timerInterval);
    this.isTimerActive = false;
    this.timerDuration = null;
    this.pauseAudio();
  }

  private getAudioElement(): HTMLAudioElement | null {
    return document.getElementById('audioElement') as HTMLAudioElement;
  }
}
