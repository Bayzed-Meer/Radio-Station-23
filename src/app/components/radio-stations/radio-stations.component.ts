import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FavoriteStationsService } from '../../services/favorite-stations.service';
import { FilterService } from '../../services/filter.service';
import { StationsService } from '../../services/stations.service';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'app-radio-stations',
  templateUrl: './radio-stations.component.html',
  styleUrls: ['./radio-stations.component.scss'],
})
export class RadioStationsComponent implements OnInit, AfterViewInit {
  currentPlayingStation: string | null = null;
  currentPlayingStationInfo: any = null;
  playPauseIcon: string = 'play_arrow';
  stations: any[] = [];
  filteredStations: any[] = [];

  constructor(
    private stationsService: StationsService,
    private filterService: FilterService,
    private favoriteStationsService: FavoriteStationsService,
    private audioService: AudioService
  ) {}

  ngOnInit() {
    this.stationsService.getStations().subscribe(
      (stations) => {
        this.stations = stations;

        this.filterService.getSelectedFilters().subscribe((filters) => {
          this.applyFilters(filters);
        });
      },
      (error) => {
        console.error('Error fetching stations:', error);
      }
    );
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
