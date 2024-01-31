import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  @Output() sidenavToggle = new EventEmitter<void>();

  // Function to emit toggle event
  toggleSidenav() {
    this.sidenavToggle.emit();
  }
}
