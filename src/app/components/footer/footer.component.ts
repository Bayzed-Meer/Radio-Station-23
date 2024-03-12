import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AudioService } from 'src/app/services/audio.service';
import { FavoriteStationsService } from '../../services/favorite-stations.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  @Input() currentPlayingStationInfo: any;
  @Input() playPauseIcon!: string;

  @Output() togglePlayPause = new EventEmitter<void>();

  timerDuration: number | null = null;
  isTimerActive: boolean = false;
  timerInterval: any;
  isMuted: boolean = false;
  isFavorite: boolean = false;

  constructor(
    private favoriteStationsService: FavoriteStationsService,
    private audioService: AudioService
  ) {}

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
    this.audioService.toggleMute();
    this.isMuted = !this.isMuted;
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
    this.togglePlayPause.emit(this.currentPlayingStationInfo);
  }
}
