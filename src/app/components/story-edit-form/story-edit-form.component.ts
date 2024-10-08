import { StoryInterface } from '../../models/story.interface';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { ReactiveFormsModule, Validators, NonNullableFormBuilder } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LANGUAGES } from 'src/app/models/languages.enum';
import { RxDocument } from 'rxdb';
import { DbService } from 'src/app/services/db-service/db-service.service';
import { COLLECTION_NAMES } from 'src/app/services/db-service/db-settings';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'story-edit-form',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './story-edit-form.component.html',
  styleUrl: './story-edit-form.component.scss'
})
export class StoryEditFormComponent implements OnInit, OnDestroy {

  @Input() storyId!: string;
  @Input() story$!: Observable<StoryInterface>;

  public availableLanguages = Object.values(LANGUAGES);
  public story: StoryInterface | null = null;

  private formBuilder = inject(NonNullableFormBuilder);
  private dbService = inject(DbService);
  private router = inject(Router);

  private storySubscription: Subscription | null = null;

  public storyEditForm = this.formBuilder.group({
    id: [''],
    name: ['', Validators.required],
    languages: [[] as string[], Validators.required],
    description: [''],
  });


  ngOnInit() {
    this.setupStory();
  }

  ngOnDestroy() {
    if (this.storySubscription) {
      this.storySubscription.unsubscribe();
    }
  }

  public setupStory() {
    console.log(`LOL: StoryID: ${this.storyId}`);
    if (this.storyId) {
      this.storySubscription = this.story$.subscribe((story) => {
        console.log(`LOL: Story: ${JSON.stringify(story)}`)
        this.story = story;
        this.storyEditForm.patchValue({
          id: this.story?.id,
          name: this.story?.name,
          languages: this.story?.languages,
          description: this.story?.description,
        });
      });
    }
  }

  public async save() {
    const story = await this.saveStory();
    this.updateInterface(story, !this.story?.id);
  };

  public async saveStory(): Promise<RxDocument<StoryInterface>> {
    const formValues = this.storyEditForm.value;
    if (!(formValues.name && formValues.languages?.length)) {
      throw new Error('LOL Error on saving the story because of the missing required values');
    }
    const newStory: Omit<StoryInterface, 'id'> = {
      name: formValues.name,
      languages: formValues.languages.map((language) => {
        return LANGUAGES[Object.keys(LANGUAGES)[(Object.values(LANGUAGES) as string[]).indexOf(language)] as keyof typeof LANGUAGES]
      }),
      description: formValues.description,
    };

    if (!this.story?.id) {
      return await this.addStory(newStory);
    } else {
      const editedStory: StoryInterface = {
        ...newStory,
        id: this.story.id,
      };
      return await this.editStory(this.story.id, editedStory);
    };
  };

  public addStory(newStory: Omit<StoryInterface, 'id'>): Promise<RxDocument<StoryInterface>> {
    return this.dbService.addDocument<StoryInterface>(
      COLLECTION_NAMES.STORIES,
      newStory,
    );
  };

  public editStory(storyId: string, editedStory: StoryInterface): Promise<RxDocument<StoryInterface>> {
    return this.dbService.updateDocument(COLLECTION_NAMES.STORIES, storyId, editedStory);
  }

  public updateInterface(story: StoryInterface, changeRouting = false) {
    this.story = {
      ... this.story,
      ...story,
      id: story.id
    };
    if (changeRouting) {
      this.router.navigate(['/editor/stories', story.id]);
      this.storyEditForm.patchValue({
        id: story.id,
      });
    };
  };
}