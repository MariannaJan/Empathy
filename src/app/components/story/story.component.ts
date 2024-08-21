import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Observable } from 'rxjs';

import { DbService } from 'src/app/services/db-service/db-service.service';
import { COLLECTION_NAMES } from 'src/app/services/db-service/db-settings';
import { ChapterInterface } from 'src/app/models/chapter.interface';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { StoryInterface } from 'src/app/models/story.interface';

@Component({
  selector: 'story',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './story.component.html',
  styleUrl: './story.component.scss'
})
export class StoryComponent {

  @Input() storyId!: string;
  private dbService = inject(DbService);

  public story$ = this.getStory();
  @Input() public chapters$!: Observable<ChapterInterface[]>;


  ngOnInit() {
    this.story$ = this.getStory();
  }

  public async getStory() {
    return (await this.dbService.getDocumentById<StoryInterface>(COLLECTION_NAMES.STORIES, this.storyId));
  }

}
