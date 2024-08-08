import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Observable, map } from 'rxjs';

import { DbService } from 'src/app/services/db-service/db-service.service';
import { COLLECTION_NAMES } from 'src/app/services/db-service/db-settings';
import { ChapterInterface } from 'src/app/models/chapter.interface';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { StoryInterface } from 'src/app/models/story.interface';

@Component({
  selector: 'app-chapters',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './chapters.component.html',
  styleUrl: './chapters.component.scss'
})
export class ChaptersComponent {

  @Input() storyId!: string;
  private dbService = inject(DbService);

  public chapters$ = this.getChapters();
  public story$ = this.getStory();



  public async getChapters(): Promise<Observable<ChapterInterface[]>> {
    return (await this.dbService.getAllCollectionDocs<ChapterInterface>(COLLECTION_NAMES.CHAPTERS))
      .pipe(
        map(
          (chapters) => {
            return chapters.filter(
              (chapter) => chapter.storyId == this.storyId
            )
              .sort((a, b) => a.chapterNumber - b.chapterNumber)
          }
        ),
      )
  };

  ngOnInit() {
    this.story$ = this.getStory();
  }

  public async getStory() {
    return (await this.dbService.getDocumentById<StoryInterface>(COLLECTION_NAMES.STORIES, this.storyId));
  }

}
