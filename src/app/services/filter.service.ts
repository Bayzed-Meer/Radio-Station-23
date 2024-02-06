import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private selectedFiltersSubject = new BehaviorSubject<any>({});
  selectedFilters$ = this.selectedFiltersSubject.asObservable();

  constructor() {}

  setSelectedFilters(filters: any) {
    this.selectedFiltersSubject.next(filters);
  }

  getSelectedFilters(): Observable<any> {
    return this.selectedFilters$;
  }
}
