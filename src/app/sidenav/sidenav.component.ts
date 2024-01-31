import { Component } from '@angular/core';
import { SelectedComponentService } from '../selected-component.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent {
  navigationItems = [
    { iconClasses: 'fa fa-radio', label: 'Browse' },
    { iconClasses: 'fa fa-earth-americas', label: 'Radio Map' },
    { iconClasses: 'pi pi-bookmark-fill', label: 'Favorites' },
  ];
  constructor(private selectedComponentService: SelectedComponentService) {}

  onLinkClick(componentName: string) {
    this.selectedComponentService.setSelectedComponent(componentName);
  }
}
