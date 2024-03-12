import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { LatLngTuple } from 'leaflet';
import { StationsService } from '../../services/stations.service';
import { ThemeSwitcherService } from '../../services/theme-switcher.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  private map!: L.Map;
  private stations: any[] = [];
  private isDarkMode: boolean = false;

  constructor(
    private stationsService: StationsService,
    private themeSwitcherService: ThemeSwitcherService
  ) {}

  ngAfterViewInit(): void {
    this.initializeMap();
    this.fetchStations();
    this.themeSwitcherService.themeChanges.subscribe((isLightMode: boolean) => {
      this.isDarkMode = !isLightMode;
      this.loadMapLayers();
      this.markStationsOnMap();
    });
  }

  private initializeMap(): void {
    const mapContainer = this.mapContainer.nativeElement;
    const ukCenter: LatLngTuple = [50.1210147, 8.3247638];

    this.map = L.map(mapContainer).setView(ukCenter, 6);

    this.loadMapLayers();
  }

  private loadMapLayers(): void {
    if (this.map) {
      this.map.eachLayer((layer) => {
        this.map.removeLayer(layer);
      });

      const tileLayer = this.isDarkMode
        ? L.tileLayer(
            'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
            {
              attribution: '© CARTO',
            }
          )
        : L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          });

      tileLayer.addTo(this.map);
    } else {
      console.error('Map not initialized yet. Skipping layer loading.');
    }
  }

  private fetchStations(): void {
    this.stationsService.getStationsWithGeolocation().subscribe(
      (stations) => {
        this.stations = stations;
        this.markStationsOnMap();
      },
      (error) => {
        console.error('Error fetching stations with geolocation:', error);
      }
    );
  }

  private markStationsOnMap(): void {
    const customIcon = L.icon({
      iconUrl: '../../../assets/locationIcon.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    this.stations.forEach((station) => {
      if (station.geo_lat && station.geo_long) {
        const marker = L.marker([station.geo_lat, station.geo_long], {
          icon: customIcon,
        });
        const popupContent = this.createPopupContent(station);

        marker.addTo(this.map).bindPopup(popupContent, {
          minWidth: 150,
        });
      }
    });
  }

  private createPopupContent(station: any): string {
    return `
      <div class="flex items-center text-left">
        <img src="${station.favicon}" alt="Station Favicon" class="w-12 h-12 rounded-full mr-4">
        <div>
          <div class="font-bold">${station.name}</div>
          <div>Votes: ${station.votes}</div>
        </div>
      </div>
    `;
  }
}
