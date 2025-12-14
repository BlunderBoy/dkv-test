import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sorters } from './sorters';

describe('Sorters', () => {
  let component: Sorters;
  let fixture: ComponentFixture<Sorters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sorters]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sorters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
