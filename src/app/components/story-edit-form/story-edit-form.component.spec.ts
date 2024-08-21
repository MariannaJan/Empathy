import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryEditFormComponent } from './story-edit-form.component';

describe('StoryEditFormComponent', () => {
  let component: StoryEditFormComponent;
  let fixture: ComponentFixture<StoryEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoryEditFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoryEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
