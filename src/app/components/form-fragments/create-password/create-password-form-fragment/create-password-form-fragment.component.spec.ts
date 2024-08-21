import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePasswordFormFragmentComponent } from './create-password-form-fragment.component';

describe('CreatePasswordFormFragmentComponent', () => {
  let component: CreatePasswordFormFragmentComponent;
  let fixture: ComponentFixture<CreatePasswordFormFragmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePasswordFormFragmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePasswordFormFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
