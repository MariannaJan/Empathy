import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DbService } from 'src/app/services/db-service/db-service.service';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';

import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { COLLECTION_NAMES } from 'src/app/services/db-service/db-settings';
import { ChapterInterface } from 'src/app/models/chapter.interface';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'chapter-edit',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
  ],
  templateUrl: './chapter-edit.component.html',
  styleUrl: './chapter-edit.component.scss'
})
export class ChapterEditComponent {

  private dbService = inject(DbService);
  private dialog = inject(MatDialog);

  public chapters$ = this.getChapters();

  public async getChapters(): Promise<BehaviorSubject<ChapterInterface[]>> {
    return await this.dbService.getAllCollectionDocs<ChapterInterface>(COLLECTION_NAMES.CHAPTERS)
  };

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
