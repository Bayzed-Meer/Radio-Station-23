import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Country } from '../country.model';
import { CountryService } from '../country.service';
import { Language } from '../language.model';
import { LanguageService } from '../language.service';
import { FilterService } from '../filter.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css'],
})
export class BrowseComponent implements OnInit {
  searchControl = new FormControl();
  languageControl = new FormControl();
  nameControl = new FormControl();

  countries: Country[] = [];
  languages: Language[] = [];
  names: string[] = [
    'Station 1',
    'Station 2',
    'Station 3',
    'Station 4',
    'Station 5',
  ];

  filteredCountries: Country[] = [];
  filteredLanguages: Language[] = [];
  filteredNames: string[] = [];

  constructor(
    private countryService: CountryService,
    private languageService: LanguageService,
    private filterService: FilterService
  ) {}

  ngOnInit() {
    // Fetch data on initialization
    this.fetchCountries();
    this.fetchLanguages();
  }

  fetchCountries() {
    this.countryService.getCountries().subscribe(
      (countries) => {
        this.countries = countries.sort((a, b) => a.name.localeCompare(b.name));
        this.filteredCountries = this.countries.slice(0, 5);
      },
      (error) => {
        console.error('Error fetching countries:', error);
        // Handle error as needed
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
        // Handle error as needed
      }
    );
  }

  onFocus(field: string) {
    switch (field) {
      case 'country':
        this.filteredCountries = this.countries.slice(0, 5);
        break;
      case 'language':
        this.filteredLanguages = this.languages.slice(0, 5);
        break;
      case 'name':
        this.filteredNames = this.names.slice(0, 5);
        break;
    }
  }

  filterItems(field: string) {
    const searchQuery = this.getControlValue(field);

    switch (field) {
      case 'country':
        this.filteredCountries = searchQuery
          ? this.countries.filter((country) =>
              country.name.includes(searchQuery)
            )
          : this.countries.slice(0, 5);
        break;
      case 'language':
        this.filteredLanguages = searchQuery
          ? this.languages.filter((language) =>
              language.name.includes(searchQuery)
            )
          : this.languages.slice(0, 5);
        break;
      case 'name':
        this.filteredNames = searchQuery
          ? this.names.filter((name) => name.includes(searchQuery))
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
      country: this.extractFirstWord(this.getControlValue('country')),
      language: this.extractFirstWord(this.getControlValue('language')),
      name: this.extractFirstWord(this.getControlValue('name')),
    };

    this.filterService.setSelectedFilters(filters);
  }

  private extractFirstWord(value: string): string {
    return value ? value.split(' ')[0] : '';
  }
}
