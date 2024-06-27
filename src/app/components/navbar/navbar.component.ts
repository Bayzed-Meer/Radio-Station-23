import { Component, EventEmitter, Output } from '@angular/core';
import { MatSlideToggleChange, MatSlideToggle } from '@angular/material/slide-toggle';
import { ThemeSwitcherService } from '../../services/theme-switcher.service';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    standalone: true,
    imports: [
        MatIconButton,
        MatIcon,
        MatSlideToggle,
    ],
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
