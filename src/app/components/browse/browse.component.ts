import { Component } from '@angular/core';
import { StationsComponent } from '../stations/stations.component';
import { FiltersComponent } from '../filters/filters.component';

@Component({
    selector: 'app-browse',
    templateUrl: './browse.component.html',
    styleUrls: ['./browse.component.scss'],
    standalone: true,
    imports: [FiltersComponent, StationsComponent],
})
export class BrowseComponent {}
