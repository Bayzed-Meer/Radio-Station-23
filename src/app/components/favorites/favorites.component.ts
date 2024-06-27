import { Component } from '@angular/core';
import { StationsComponent } from '../stations/stations.component';

@Component({
    selector: 'app-favorites',
    templateUrl: './favorites.component.html',
    styleUrls: ['./favorites.component.scss'],
    standalone: true,
    imports: [StationsComponent],
})
export class FavoritesComponent {}
