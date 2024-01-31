import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent {
  navigationItems = [
    { iconClasses: 'fa fa-radio', label: 'Browse' },
    { iconClasses: 'fa fa-earth-americas', label: 'Radio map' },
    { iconClasses: 'pi pi-bookmark-fill', label: 'Favorites' },
  ];
  @Input() isSidenavOpen: boolean = false;
}
