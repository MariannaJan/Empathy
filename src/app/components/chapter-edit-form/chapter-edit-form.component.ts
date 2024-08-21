import { Observable, Subscription, map } from 'rxjs';
import { CommonModule } from '@angular/common';

import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { ReactiveFormsModule, Validators, NonNullableFormBuilder } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { LANGUAGES } from 'src/app/models/languages.enum';
import { ChapterInterface } from 'src/app/models/chapter.interface';
import { DbService } from 'src/app/services/db-service/db-service.service';
import { COLLECTION_NAMES } from 'src/app/services/db-service/db-settings';
import { StoryInterface } from 'src/app/models/story.interface';
import { RxDocument } from 'rxdb';


@Component({
  selector: 'chapter-edit-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
  ],
  templateUrl: './chapter-edit-form.component.html',
  styleUrl: './chapter-edit-form.component.scss'
})
export class ChapterEditFormComponent implements OnInit, OnDestroy {

  @Input() public storyId!: string;
  @Input() public chapterId!: string;
  @Input() public chapter$!: Observable<ChapterInterface>;
  @Input() public stories$!: Observable<StoryInterface[]>;

  public chapter: ChapterInterface | null = null;

  public availableLanguages = Object.values(LANGUAGES);

  private formBuilder = inject(NonNullableFormBuilder);
  private dbService = inject(DbService);
  private router = inject(Router);

  private chapterSubscription: Subscription | null = null;

  public chapterEditForm = this.formBuilder.group({
    id: [''],
    name: ['', Validators.required],
    story: ['', Validators.required],
    chapterNo: [0, Validators.required],
    language: ['', Validators.required],
    author: [''],
    isPremium: [false],
    description: [''],
    empathyName: ['', Validators.required],
    sympathyName: ['', Validators.required]
  });

  ngOnInit(): void {
    this.setupChapter();
  }

  ngOnDestroy(): void {
    if (this.chapterSubscription) {
      this.chapterSubscription.unsubscribe;
    }
  }
  public setupChapter() {
    console.log(`LOL: ChapterID: ${this.chapterId}, stroryId: ${this.storyId}`);
    this.chapterSubscription = this.chapter$.subscribe((chapter) => {
      this.chapter = chapter;
      this.chapterEditForm.patchValue({
        id: this.chapter?.id,
        name: this.chapter?.name,
        story: this.chapter?.story_id || this.storyId,
        chapterNo: this.chapter?.chapter_number,
        language: this.chapter?.language,
        author: this.chapter?.author,
        isPremium: this.chapter?.is_premium,
        description: this.chapter?.description,
        empathyName: this.chapter?.empathy_name || 'empathy',
        sympathyName: this.chapter?.sympathy_name || 'sympathy',
      });
    });

  }

  public async save() {
    const shouldUpdate = !this.chapter?.id || (this.storyId != this.chapterEditForm.value.story);
    const chapter = await this.saveChapter();
    this.updateInterface(chapter, shouldUpdate)
    console.log(`LOL: Saving chapter: ${JSON.stringify(this.chapterEditForm.value)}`);
  }

  public async saveChapter(): Promise<RxDocument<ChapterInterface>> {
    const formValues = this.chapterEditForm.value;
    if (!(formValues.name
      && formValues.story
      && formValues.chapterNo
      && formValues.language
      && formValues.empathyName
      && formValues.sympathyName)) {
      throw new Error('LOL Error on saving the chapter because of the missing required values');
    }

    const newChapter: Omit<ChapterInterface, 'id'> = {
      name: formValues.name,
      story_id: formValues.story,
      chapter_number: formValues.chapterNo,
      language: LANGUAGES[Object.keys(LANGUAGES)[(Object.values(LANGUAGES) as string[]).indexOf(formValues.language)] as keyof typeof LANGUAGES],
      author: formValues.author,
      is_premium: formValues.isPremium,
      description: formValues.description,
      empathy_name: formValues.empathyName,
      sympathy_name: formValues.sympathyName,
    }

    if (!this.chapter?.id) {
      return await this.dbService.addDocument(COLLECTION_NAMES.CHAPTERS, newChapter);
    } else {
      const editedChapter: ChapterInterface = {
        id: this.chapter.id,
        ...newChapter
      };
      return await this.dbService.updateDocument(COLLECTION_NAMES.CHAPTERS, this.chapter.id, editedChapter);
    };
  }

  public updateInterface(chapter: ChapterInterface, changeRouting = false) {
    this.chapter = {
      ...this.chapter,
      ...chapter,
      id: chapter.id
    };
    if (changeRouting) {
      this.router.navigate(['/editor/stories', this.chapterEditForm.value.story, 'chapters', chapter.id]);
      this.chapterEditForm.patchValue({
        id: chapter.id,
      })
    }
  }

}
