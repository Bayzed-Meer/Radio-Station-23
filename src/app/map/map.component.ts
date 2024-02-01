import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { LatLngTuple } from 'leaflet';
import { StationsService } from '../stations.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  private map!: L.Map;
  private stations: any[] = [];

  constructor(private stationsService: StationsService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.initializeMap();
      this.fetchStations();
    }, 100);
  }

  private initializeMap(): void {
    const mapContainer = this.mapContainer.nativeElement;
    const ukCenter: LatLngTuple = [50.1210147, 8.3247638];

    this.map = L.map(mapContainer).setView(ukCenter, 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.map.invalidateSize();
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
