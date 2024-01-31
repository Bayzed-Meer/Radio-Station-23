// display.component.ts

import { Component, OnDestroy, OnInit } from '@angular/core';
import { SelectedComponentService } from '../selected-component.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css'],
})
export class DisplayComponent implements OnInit, OnDestroy {
  selectedComponent!: string;
  private destroy$ = new Subject<void>();

  constructor(private selectedComponentService: SelectedComponentService) {}

  ngOnInit() {
    this.selectedComponentService.selectedComponent$
      .pipe(takeUntil(this.destroy$))
      .subscribe((component) => {
        this.selectedComponent = component;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
