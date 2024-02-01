// radio-stations.component.ts
import { Component, OnInit } from '@angular/core';
import { FilterService } from '../filter.service';
import { StationsService } from '../stations.service';

@Component({
  selector: 'app-radio-stations',
  templateUrl: './radio-stations.component.html',
  styleUrls: ['./radio-stations.component.css'],
})
export class RadioStationsComponent implements OnInit {
  likedStatus: Map<string, boolean> = new Map();
  playingStatus: Map<string, boolean> = new Map();
  currentPlayingStation: string | null = null;
  currentPlayingStationInfo: any = null;
  playPauseIcon: string = 'play_arrow';
  stations: any[] = [];
  filteredStations: any[] = [];
  timerDuration: number | null = null;
  isTimerActive: boolean = false;
  timerInterval: any;

  constructor(
    private stationsService: StationsService,
    private filterService: FilterService
  ) {}

  ngOnInit() {
    this.stationsService.getStations().subscribe(
      (stations) => {
        this.stations = stations.sort((a, b) => b.votes - a.votes);

        const likedStatus = localStorage.getItem('likedStatus');
        this.likedStatus = likedStatus
          ? new Map(JSON.parse(likedStatus))
          : new Map();

        this.stations.forEach((station) => {
          this.playingStatus.set(station.stationuuid, false);
        });

        this.filterService.getSelectedFilters().subscribe((filters) => {
          this.applyFilters(filters);
        });

        // Set initial play/pause icon state
        this.updatePlayPauseIcon();
      },
      (error) => {
        console.error('Error fetching stations:', error);
      }
    );
  }

  applyFilters(filters: any) {
    if (
      !filters.country &&
      !filters.language &&
      !filters.name &&
      !filters.url
    ) {
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

      const urlFilter =
        !filters.url ||
        station.url.toLowerCase().includes(filters.url.toLowerCase());

      return countryFilter && languageFilter && nameFilter && urlFilter;
    });
  }

  toggleLike(stationUuid: string) {
    const currentStatus = this.likedStatus.get(stationUuid) || false;
    this.likedStatus.set(stationUuid, !currentStatus);

    // Save liked status to local storage
    localStorage.setItem(
      'likedStatus',
      JSON.stringify(Array.from(this.likedStatus.entries()))
    );
  }

  togglePlayPause(station: any): void {
    const stationUuid = station.stationuuid;
    const isCurrentlyPlaying = this.playingStatus.get(stationUuid) || false;

    // If the clicked station is different, stop the current one and play the new one
    if (this.currentPlayingStation !== stationUuid) {
      this.stopAndPlay(stationUuid, station.url_resolved);
    } else {
      // If the clicked station is the same, toggle between play and pause
      this.togglePlayPauseCurrent(stationUuid, isCurrentlyPlaying);
    }

    // Update the play/pause icon in the footer
    this.updatePlayPauseIcon(stationUuid);
  }

  private togglePlayPauseCurrent(
    stationUuid: string,
    isCurrentlyPlaying: boolean
  ): void {
    // Toggle between play and pause for the current station
    if (isCurrentlyPlaying) {
      this.pauseAudio(stationUuid);
    } else {
      this.playAudio(
        this.filteredStations.find(
          (station) => station.stationuuid === stationUuid
        )?.url_resolved || '',
        stationUuid
      );
    }
    this.playingStatus.set(stationUuid, !isCurrentlyPlaying);
    this.updatePlayPauseIcon();
  }

  private stopAndPlay(stationUuid: string, url: string): void {
    // Stop the currently playing station if any
    if (this.currentPlayingStation) {
      this.pauseAudio(this.currentPlayingStation);
      this.playingStatus.set(this.currentPlayingStation, false);
    }

    // Play the new station
    this.playAudio(url, stationUuid);
    this.playingStatus.set(stationUuid, true);
    this.currentPlayingStation = stationUuid;
  }

  // Rest of the code remains the same...

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
        this.currentPlayingStation = stationUuid; // Restore the station UUID
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
        this.filteredStations.find(
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
      // Display an alert to the user for invalid input
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

    // Pause the station when the timer finishes
    this.pauseAudio();
  }

  audioEnded() {
    this.stopTimer();

    if (this.currentPlayingStation !== null) {
      this.playingStatus.set(this.currentPlayingStation, false);
      this.currentPlayingStation = null;
      this.updatePlayPauseIcon();
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

  // Helper method to get the audio element
  private getAudioElement(): HTMLAudioElement | null {
    return document.getElementById('audioElement') as HTMLAudioElement;
  }
}
