import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private audioElement!: HTMLAudioElement | null;
  isMuted: boolean = false;

  setAudioElement(audioElement: HTMLAudioElement): void {
    this.audioElement = audioElement;
  }

  play(url: string): void {
    if (this.audioElement) {
      this.audioElement.src = url;
      this.audioElement.play();
    }
  }

  pause(): void {
    if (this.audioElement) {
      this.audioElement.pause();
    }
  }
  toggleMute(): void {
    if (this.audioElement) {
      this.isMuted = !this.isMuted;
      this.audioElement.muted = this.isMuted;
    }
  }
}
