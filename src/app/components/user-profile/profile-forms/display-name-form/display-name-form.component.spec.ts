import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayNameFormComponent } from './display-name-form.component';

describe('DisplayNameFormComponent', () => {
  let component: DisplayNameFormComponent;
  let fixture: ComponentFixture<DisplayNameFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayNameFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayNameFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
