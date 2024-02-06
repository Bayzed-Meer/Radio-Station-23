import { Component, EventEmitter, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ThemeSwitcherService } from '../../services/theme-switcher.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  @Output() sidenavToggle = new EventEmitter<void>();

  isLightMode: boolean;

  constructor(private themeSwitcher: ThemeSwitcherService) {
    this.isLightMode = this.themeSwitcher.isLightMode;
  }

  toggleSidenav() {
    this.sidenavToggle.emit();
  }

  toggle(event: MatSlideToggleChange) {
    this.themeSwitcher.setTheme(event.checked);
  }
}
