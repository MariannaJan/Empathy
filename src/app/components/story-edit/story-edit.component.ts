import { CommonModule } from '@angular/common';
import { COLLECTION_NAMES } from './../../services/db-service/db-settings';
import { Component, Input, inject } from '@angular/core';
import { DbService } from 'src/app/services/db-service/db-service.service';
import { StoryInterface } from 'src/app/models/story.interface';
import { Observable } from 'rxjs';
import { RxDocument } from 'rxdb';
import { StoryEditFormComponent } from './story-edit-form/story-edit-form.component';


@Component({
  selector: 'story-edit',
  standalone: true,
  imports: [
    CommonModule,
    StoryEditFormComponent,
  ],
  templateUrl: './story-edit.component.html',
  styleUrl: './story-edit.component.scss'
})
export class StoryEditComponent {

  @Input() storyId!: string;
  public dbService = inject(DbService);
  public story$: Promise<Observable<RxDocument<StoryInterface>>>;

  constructor() {
    this.story$ = this.dbService.getDocumentById<StoryInterface>(COLLECTION_NAMES.STORIES, this.storyId);
  }
  ngOnInit() {
    this.story$ = this.dbService.getDocumentById<StoryInterface>(COLLECTION_NAMES.STORIES, this.storyId);
  }

}
