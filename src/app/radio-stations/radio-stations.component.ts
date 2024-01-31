import { Component, OnInit } from '@angular/core';
import { StationsService } from '../stations.service';

@Component({
  selector: 'app-radio-stations',
  templateUrl: './radio-stations.component.html',
  styleUrls: ['./radio-stations.component.css'],
})
export class RadioStationsComponent implements OnInit {
  isLiked: boolean = false;
  isPlaying: boolean = false;
  stations: any[] = [];

  constructor(private stationsService: StationsService) {}

  ngOnInit() {
    this.stationsService.getStations().subscribe(
      (stations) => {
        // Sort stations by votes in descending order
        this.stations = stations.sort((a, b) => b.votes - a.votes);
        console.log(this.stations);
      },
      (error) => {
        console.error('Error fetching stations:', error);
        // Handle error as needed
      }
    );
  }
  toggleLike() {
    this.isLiked = !this.isLiked;
  }
  togglePlayPause() {
    this.isPlaying = !this.isPlaying;
    // Add logic for play/pause functionality (e.g., audio playback control)
  }
}
