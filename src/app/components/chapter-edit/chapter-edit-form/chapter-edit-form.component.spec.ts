import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapterEditFormComponent } from './chapter-edit-form.component';

describe('ChapterEditFormComponent', () => {
  let component: ChapterEditFormComponent;
  let fixture: ComponentFixture<ChapterEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChapterEditFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChapterEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
