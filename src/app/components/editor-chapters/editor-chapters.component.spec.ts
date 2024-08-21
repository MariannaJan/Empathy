import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorChaptersComponent } from './editor-chapters.component';

describe('EditorChaptersComponent', () => {
  let component: EditorChaptersComponent;
  let fixture: ComponentFixture<EditorChaptersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorChaptersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorChaptersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
