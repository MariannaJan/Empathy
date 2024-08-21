import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { ChapterInterface } from 'src/app/models/chapter.interface';
import { DbService } from 'src/app/services/db-service/db-service.service';
import { COLLECTION_NAMES } from 'src/app/services/db-service/db-settings';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { StoryInterface } from 'src/app/models/story.interface';

@Component({
  selector: 'editor-chapters',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
  ],
  templateUrl: './editor-chapters.component.html',
  styleUrl: './editor-chapters.component.scss'
})
export class EditorChaptersComponent {

  @Input() public storyId!: string;
  @Input() public chapters$!: Observable<ChapterInterface[]>;
  @Input() public story$!: Observable<StoryInterface>;

  private dbService = inject(DbService);
  private dialog = inject(MatDialog);

  public async delete(chapter: ChapterInterface) {
    this.dialog.open(DeleteConfirmationComponent, {
      data: {
        id: chapter.id,
        name: chapter.name,
        collection: COLLECTION_NAMES.CHAPTERS,
        deleteFunction: () => this.deleteChapter(chapter),
      }
    });
  };

  public deleteChapter(chapter: ChapterInterface) {
    console.log(`LOL: Deleting chapter: ${chapter.name}: ${chapter.id}`);
    this.dbService.deleteDocument<ChapterInterface>(COLLECTION_NAMES.CHAPTERS, chapter.id);
  }
}
