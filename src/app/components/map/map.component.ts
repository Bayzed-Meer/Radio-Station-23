import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { LatLngTuple } from 'leaflet';
import { StationsService } from '../../services/stations.service';
import { ThemeSwitcherService } from '../../services/theme-switcher.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  private map!: L.Map;
  private stations: any[] = [];
  private isDarkMode: boolean = false;

  constructor(
    private stationsService: StationsService,
    private themeSwitcherService: ThemeSwitcherService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.initializeMap();
      this.fetchStations();
    }, 100);

    this.themeSwitcherService.themeChanges.subscribe((isLightMode: boolean) => {
      this.isDarkMode = !isLightMode;
      this.loadMapLayers();
    });
  }

  private initializeMap(): void {
    const mapContainer = this.mapContainer.nativeElement;
    const ukCenter: LatLngTuple = [50.1210147, 8.3247638];

    this.map = L.map(mapContainer).setView(ukCenter, 6);

    // Load initial map layers
    this.loadMapLayers();

    this.map.invalidateSize();
  }

  private loadMapLayers(): void {
    // Remove existing layers
    this.map.eachLayer((layer) => {
      this.map.removeLayer(layer);
    });

    // Choose different layers based on the theme
    const tileLayer = this.isDarkMode
      ? L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
          {
            attribution: '© CARTO',
          }
        )
      : L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        });

    tileLayer.addTo(this.map);
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
    // Clear existing markers
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
      }
    });

    this.stations.forEach((station) => {
      if (station.geo_lat && station.geo_long) {
        const marker = L.marker([station.geo_lat, station.geo_long]);
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
