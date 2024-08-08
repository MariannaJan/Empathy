import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapterEditChooserComponent } from './chapter-edit-chooser.component';

describe('ChapterEditChooserComponent', () => {
  let component: ChapterEditChooserComponent;
  let fixture: ComponentFixture<ChapterEditChooserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChapterEditChooserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChapterEditChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
