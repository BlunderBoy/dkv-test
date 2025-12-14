import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditDialog } from './create-edit-dialog';

describe('CreateEditDialog', () => {
  let component: CreateEditDialog;
  let fixture: ComponentFixture<CreateEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEditDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEditDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
