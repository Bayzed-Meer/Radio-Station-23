import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { StationsService } from '../../services/stations.service';
import { FavoriteStationsService } from '../../services/favorite-stations.service';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent implements OnInit, AfterViewInit {
  currentPlayingStation: string | null = null;
  currentPlayingStationInfo: any = null;
  playPauseIcon: string = 'play_arrow';
  favoriteStations: any[] = [];
  constructor(
    private stationsService: StationsService,
    private favoriteStationsService: FavoriteStationsService,
    private audioService: AudioService
  ) {}

  ngOnInit(): void {
    this.loadFavoriteStations();
  }

  @ViewChild('audioElement', { static: false }) audioElementRef!: ElementRef;

  ngAfterViewInit() {
    setTimeout(() => {
      const audioElement = this.audioElementRef
        ?.nativeElement as HTMLAudioElement;

      if (audioElement) {
        this.audioService.setAudioElement(audioElement);
      }
    }, 2000);
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
    const stationUrl = station.url_resolved;
    if (stationUuid === this.currentPlayingStation) {
      this.audioService.pause();
      this.updatePlayPauseIcon();
      this.currentPlayingStation = null;
    } else {
      if (this.currentPlayingStation !== null) this.audioService.pause();
      this.currentPlayingStationInfo = station;
      this.currentPlayingStation = stationUuid;
      this.audioService.play(stationUrl);
      this.updatePlayPauseIcon();
    }
  }

  updatePlayPauseIcon(): void {
    this.playPauseIcon =
      this.playPauseIcon === 'play_arrow' ? 'pause' : 'play_arrow';
  }
}
