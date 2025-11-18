import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackInfo } from './track-info';

describe('TrackInfo', () => {
  let component: TrackInfo;
  let fixture: ComponentFixture<TrackInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
