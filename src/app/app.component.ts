import { Component, OnInit } from '@angular/core';
import { SelectedComponentService } from './selected-component.service'; // Adjust the path if needed

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isSidenavOpen = true; // Adjust the initial state as needed

  constructor(private selectedComponentService: SelectedComponentService) {}

  ngOnInit() {
    this.selectedComponentService.setSelectedComponent('Browse');
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }
}
