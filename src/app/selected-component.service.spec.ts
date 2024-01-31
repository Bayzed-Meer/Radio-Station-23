import { TestBed } from '@angular/core/testing';

import { SelectedComponentService } from './selected-component.service';

describe('SelectedComponentService', () => {
  let service: SelectedComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectedComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
