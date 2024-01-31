import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Radio-Station-23';
  isSidenavOpen: boolean = false;

  // Function to toggle sidenav state
  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }
}
