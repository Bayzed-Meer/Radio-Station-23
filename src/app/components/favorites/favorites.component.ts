import { Component, OnInit } from '@angular/core';
import { StationsService } from '../../services/stations.service';
import { FavoriteStationsService } from '../../services/favorite-stations.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent implements OnInit {
  playingStatus: Map<string, boolean> = new Map();
  currentPlayingStation: string | null = null;
  currentPlayingStationInfo: any = null;
  playPauseIcon: string = 'play_arrow';
  favoriteStations: any[] = [];
  timerDuration: number | null = null;
  isTimerActive: boolean = false;
  timerInterval: any;

  constructor(
    private stationsService: StationsService,
    private favoriteStationsService: FavoriteStationsService
  ) {}

  ngOnInit(): void {
    this.loadFavoriteStations();
  }

  loadFavoriteStations(): void {
    const favoriteStationUuids =
      this.favoriteStationsService.getFavoriteStations();

    this.stationsService.getStations().subscribe(
      (stations) => {
        this.favoriteStations = stations.filter((station) =>
          favoriteStationUuids.includes(station.stationuuid)
        );
      },
      (error) => {
        console.error('Error fetching stations:', error);
      }
    );
  }

  toggleFavorite(stationUuid: any): void {
    this.favoriteStationsService.removeFromFavoriteStations(stationUuid);
    this.loadFavoriteStations();
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
        this.favoriteStations.find(
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
        this.favoriteStations.find(
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
