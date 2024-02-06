import { Component, OnInit } from '@angular/core';
import { FilterService } from '../../services/filter.service';
import { StationsService } from '../../services/stations.service';
import { FavoriteStationsService } from '../../services/favorite-stations.service';

@Component({
  selector: 'app-radio-stations',
  templateUrl: './radio-stations.component.html',
  styleUrls: ['./radio-stations.component.scss'],
})
export class RadioStationsComponent implements OnInit {
  playingStatus: Map<string, boolean> = new Map();
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
    const isCurrentlyPlaying = this.playingStatus.get(stationUuid) || false;

    if (this.currentPlayingStation !== stationUuid) {
      this.stopAndPlay(stationUuid, station.url_resolved);
    } else {
      this.togglePlayPauseCurrent(stationUuid, isCurrentlyPlaying);
    }

    this.updatePlayPauseIcon(stationUuid);
  }

  private togglePlayPauseCurrent(
    stationUuid: string,
    isCurrentlyPlaying: boolean
  ): void {
    if (isCurrentlyPlaying) {
      this.pauseAudio(stationUuid);
    } else {
      this.playAudio(
        this.filteredStations.find(
          (station) => station.stationuuid === stationUuid
        )?.url_resolved || '',
        stationUuid
      );
    }
    this.playingStatus.set(stationUuid, !isCurrentlyPlaying);
    this.updatePlayPauseIcon();
  }

  private stopAndPlay(stationUuid: string, url: string): void {
    if (this.currentPlayingStation) {
      this.pauseAudio(this.currentPlayingStation);
      this.playingStatus.set(this.currentPlayingStation, false);
    }

    this.playAudio(url, stationUuid);
    this.playingStatus.set(stationUuid, true);
    this.currentPlayingStation = stationUuid;
  }

  playAudio(url: string, stationUuid: string): void {
    const audioElement = this.getAudioElement();
    if (audioElement) {
      audioElement.src = url;
      audioElement
        .play()
        .then(() => {
          this.currentPlayingStation = stationUuid;
        })
        .catch((error) => {
          console.error('Error playing audio:', error);
        });
    }
  }

  pauseAudio(stationUuid?: string): void {
    const audioElement = this.getAudioElement();
    if (
      audioElement &&
      !audioElement.paused &&
      !audioElement.ended &&
      audioElement.currentTime > 0
    ) {
      audioElement.pause();
      if (stationUuid) {
        this.currentPlayingStation = stationUuid;
      }
    }
    this.updatePlayPauseIcon(stationUuid);
  }

  updatePlayPauseIcon(stationUuid?: string): void {
    if (stationUuid) {
      this.playPauseIcon = this.playingStatus.get(stationUuid)
        ? 'pause'
        : 'play_arrow';
      this.currentPlayingStationInfo =
        this.filteredStations.find(
          (station) => station.stationuuid === stationUuid
        ) || null;
    } else {
      this.playPauseIcon = this.currentPlayingStationInfo
        ? 'pause'
        : 'play_arrow';
    }
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

    this.playingStatus.forEach((value, key) => {
      this.playingStatus.set(key, false);
    });
    this.pauseAudio();
    this.currentPlayingStationInfo = null;
  }

  audioEnded() {
    this.stopTimer();

    if (this.currentPlayingStation !== null) {
      this.playingStatus.set(this.currentPlayingStation, false);
      this.currentPlayingStation = null;
      this.updatePlayPauseIcon();
    }
  }

  private getAudioElement(): HTMLAudioElement | null {
    return document.getElementById('audioElement') as HTMLAudioElement;
  }
}
