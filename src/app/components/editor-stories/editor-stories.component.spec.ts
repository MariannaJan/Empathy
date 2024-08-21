import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorStoriesComponent } from './editor-stories.component';

describe('EditorStoriesComponent', () => {
  let component: EditorStoriesComponent;
  let fixture: ComponentFixture<EditorStoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorStoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
