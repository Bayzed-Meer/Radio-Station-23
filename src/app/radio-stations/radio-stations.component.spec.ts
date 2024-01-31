import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioStationsComponent } from './radio-stations.component';

describe('RadioStationsComponent', () => {
  let component: RadioStationsComponent;
  let fixture: ComponentFixture<RadioStationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RadioStationsComponent]
    });
    fixture = TestBed.createComponent(RadioStationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
