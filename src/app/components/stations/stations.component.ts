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
import { ActivatedRoute } from '@angular/router';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.scss'],
})
export class StationsComponent implements OnInit, AfterViewInit {
  currentPlayingStation: string | null = null;
  currentPlayingStationInfo: any = null;
  playPauseIcon: string = 'play_arrow';
  allStations: any[] = [];
  stations: any[] = [];
  isFavoritesRoute: boolean = false;
  loading: boolean = true;

  constructor(
    private stationsService: StationsService,
    private favoriteStationsService: FavoriteStationsService,
    private audioService: AudioService,
    private filterService: FilterService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.url.subscribe((segments) => {
      this.isFavoritesRoute = segments[0]?.path === 'favorites';
      this.loadStations();
    });
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

  loadStations(): void {
    this.loading = true;
    this.stationsService.getStations().subscribe(
      (stations) => {
        this.allStations = stations;

        if (this.isFavoritesRoute) {
          this.loadFavoriteStations();
        } else {
          this.filterService.getSelectedFilters().subscribe((filters) => {
            this.applyFilters(filters);
          });
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching stations:', error);
        this.loading = false;
      }
    );
  }

  applyFilters(filters: any) {
    if (!filters.country && !filters.language && !filters.name) {
      this.stations = this.allStations;
      return;
    }

    this.stations = this.allStations.filter((station) => {
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

  loadFavoriteStations(): void {
    const favoriteStationUuids =
      this.favoriteStationsService.getFavoriteStations();

    this.stations = this.allStations.filter((station) =>
      favoriteStationUuids.includes(station.stationuuid)
    );
  }

  toggleFavorite(stationUuid: any): void {
    if (this.favoriteStationsService.isStationFavorite(stationUuid)) {
      this.favoriteStationsService.removeFromFavoriteStations(stationUuid);
    } else {
      this.favoriteStationsService.addToFavoriteStations(stationUuid);
    }

    if (this.isFavoritesRoute) {
      this.loadFavoriteStations();
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
