import { Component, Input } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgFor } from '@angular/common';
import { MatNavList, MatListItem } from '@angular/material/list';
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';

@Component({
    selector: 'app-display',
    templateUrl: './display.component.html',
    styleUrls: ['./display.component.scss'],
    standalone: true,
    imports: [
        MatSidenavContainer,
        MatSidenav,
        MatNavList,
        NgFor,
        MatListItem,
        RouterLink,
        MatSidenavContent,
        RouterOutlet,
    ],
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
