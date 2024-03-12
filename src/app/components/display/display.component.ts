import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss'],
})
export class DisplayComponent {
  @Input() isSidenavOpen: boolean = false;

  navLinks = [
    {
      label: 'Browse',
      routerLink: 'browse',
      iconClass: 'fa-solid fa-radio px-3',
    },
    {
      label: 'Radio Map',
      routerLink: 'map',
      iconClass: 'fa-solid fa-earth-americas px-3',
    },
    {
      label: 'Favorites',
      routerLink: 'favorites',
      iconClass: 'fa-solid fa-bookmark px-[14px]',
    },
  ];
}
