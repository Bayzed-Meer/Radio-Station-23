import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger, MatAutocomplete } from '@angular/material/autocomplete';
import { Country } from '../../models//country.model';
import { Language } from '../../models/language.model';
import { CountryService } from '../../services/country.service';
import { FilterService } from '../../services/filter.service';
import { LanguageService } from '../../services/language.service';
import { StationsService } from '../../services/stations.service';
import { MatOption } from '@angular/material/core';
import { NgFor, TitleCasePipe } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';

@Component({
    selector: 'app-filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.scss'],
    standalone: true,
    imports: [
        MatFormField,
        MatLabel,
        MatInput,
        FormsModule,
        MatAutocompleteTrigger,
        ReactiveFormsModule,
        MatAutocomplete,
        NgFor,
        MatOption,
        TitleCasePipe,
    ],
})
export class FiltersComponent implements OnInit {
  searchControl = new FormControl();
  languageControl = new FormControl();
  nameControl = new FormControl();

  countries: Country[] = [];
  languages: Language[] = [];
  names: string[] = [];

  filteredCountries: Country[] = [];
  filteredLanguages: Language[] = [];
  filteredNames: string[] = [];

  constructor(
    private countryService: CountryService,
    private languageService: LanguageService,
    private filterService: FilterService,
    private stationsService: StationsService
  ) {}

  ngOnInit() {
    this.fetchCountries();
    this.fetchLanguages();
    this.fetchStations();
    this.applyFilters();
  }

  fetchCountries() {
    this.countryService.getCountries().subscribe(
      (countries) => {
        this.countries = countries.sort((a, b) => a.name.localeCompare(b.name));
        this.filteredCountries = this.countries.slice(0, 5);
      },
      (error) => {
        console.error('Error fetching countries:', error);
      }
    );
  }

  fetchLanguages() {
    this.languageService.getLanguages().subscribe(
      (languages) => {
        this.languages = languages.sort((a, b) => a.name.localeCompare(b.name));
        this.filteredLanguages = this.languages.slice(0, 5);
      },
      (error) => {
        console.error('Error fetching languages:', error);
      }
    );
  }

  fetchStations() {
    this.stationsService.getStations().subscribe(
      (stations) => {
        this.names = stations.map((station) => station.name);
        this.filteredNames = this.names.slice(0, 5);
      },
      (error) => {
        console.error('Error fetching stations:', error);
      }
    );
  }

  filterItems(field: string) {
    const searchQuery = this.getControlValue(field).toLowerCase();

    switch (field) {
      case 'country':
        this.filteredCountries = searchQuery
          ? this.countries.filter((country) =>
              country.name.toLowerCase().includes(searchQuery)
            )
          : this.countries.slice(0, 5);
        break;
      case 'language':
        this.filteredLanguages = searchQuery
          ? this.languages.filter((language) =>
              language.name.toLowerCase().includes(searchQuery)
            )
          : this.languages.slice(0, 5);
        break;
      case 'name':
        this.filteredNames = searchQuery
          ? this.names.filter((name) =>
              name.toLowerCase().includes(searchQuery)
            )
          : this.names.slice(0, 5);
        break;
    }
  }

  selectItem(event: MatAutocompleteSelectedEvent, field: string) {
    this.getControl(field).setValue(event.option.viewValue);
  }

  private getControl(field: string): FormControl {
    switch (field) {
      case 'country':
        return this.searchControl;
      case 'language':
        return this.languageControl;
      case 'name':
        return this.nameControl;
      default:
        return new FormControl();
    }
  }

  private getControlValue(field: string): string {
    return this.getControl(field).value;
  }

  applyFilters() {
    const filters = {
      country: this.filter(this.getControlValue('country')),
      language: this.filter(this.getControlValue('language')),
      name: this.filter(this.getControlValue('name')),
    };
    this.filterService.setSelectedFilters(filters);
  }

  private filter(value: string): string {
    if (value) {
      const words = value.split('|');
      return words[0].trim();
    } else {
      return '';
    }
  }
}
