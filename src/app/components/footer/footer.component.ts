import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FavoriteStationsService } from '../../services/favorite-stations.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  @Input() currentPlayingStationInfo: any;
  @Input() playPauseIcon!: string;
  @Input() isTimerActive!: boolean;
  @Input() timerDuration!: number | null;

  @Output() openTimerDialog = new EventEmitter<void>();
  @Output() togglePlayPause = new EventEmitter<void>();

  isMuted: boolean = false;
  isFavorite: boolean = false;

  constructor(private favoriteStationsService: FavoriteStationsService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentPlayingStationInfo']) {
      this.checkFavoriteStatus();
    }
  }

  private checkFavoriteStatus(): void {
    const stationId = this.currentPlayingStationInfo?.stationuuid;

    if (stationId) {
      this.isFavorite =
        this.favoriteStationsService.isStationFavorite(stationId);
    } else {
      this.isFavorite = false;
    }
  }

  toggleFavorite(): void {
    const stationId = this.currentPlayingStationInfo?.stationuuid;

    if (stationId) {
      if (this.isFavorite) {
        this.favoriteStationsService.removeFromFavoriteStations(stationId);
      } else {
        this.favoriteStationsService.addToFavoriteStations(stationId);
      }

      this.isFavorite = !this.isFavorite;
    }
  }

  toggleMute(): void {
    const audioElement = this.getAudioElement();
    if (audioElement) {
      this.isMuted = !this.isMuted;
      audioElement.muted = this.isMuted;
    }
  }

  formatTime(seconds: number | null): string {
    if (seconds === null || isNaN(seconds) || seconds <= 0) {
      return '00:00';
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  private getAudioElement(): HTMLAudioElement | null {
    return document.getElementById('audioElement') as HTMLAudioElement;
  }
}
