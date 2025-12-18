import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryPopulation } from './country-population';

describe('CountryPopulation', () => {
  let component: CountryPopulation;
  let fixture: ComponentFixture<CountryPopulation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountryPopulation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountryPopulation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
