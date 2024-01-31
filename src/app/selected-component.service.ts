import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SelectedComponentService {
  private selectedComponentSubject = new BehaviorSubject<string>('Browse');
  selectedComponent$: Observable<string> =
    this.selectedComponentSubject.asObservable();

  setSelectedComponent(componentName: string) {
    this.selectedComponentSubject.next(componentName);
  }
}
