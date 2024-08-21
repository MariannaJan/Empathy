import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// import {
//   StoryInterface,
// } from 'src/app/models/story.interface';
import { DbService } from 'src/app/services/db-service/db-service.service';
import { COLLECTION_NAMES } from 'src/app/services/db-service/db-settings';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
// import { MatDialog } from '@angular/material/dialog';

// import { BehaviorSubject } from 'rxjs';
// import { RxDocument } from 'rxdb';
// import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'editor',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
  ],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
})
export class EditorComponent {

  private dbService = inject(DbService);
  // private dialog = inject(MatDialog);

  // public stories$ = this.getStories();

  // public async getStories(): Promise<BehaviorSubject<StoryInterface[]>> {
  //   return await this.dbService.getAllCollectionDocs<StoryInterface>(
  //     COLLECTION_NAMES.STORIES
  //   );
  // }

  public replicate() {
    this.dbService.replicateCollection(COLLECTION_NAMES.STORIES);
    this.dbService.replicateCollection(COLLECTION_NAMES.CHAPTERS);
  }

  // public addStory(
  //   newStory: Omit<StoryInterface, 'id'>,
  // ): Promise<RxDocument<StoryInterface>> {
  //   return this.dbService.addDocument<StoryInterface>(
  //     COLLECTION_NAMES.STORIES,
  //     newStory,
  //   );
  // }
  // public delete(story: StoryInterface) {
  //   this.dialog.open(DeleteConfirmationComponent, {
  //     data: {
  //       id: story.id,
  //       name: story.name,
  //       collection: COLLECTION_NAMES.STORIES,
  //       deleteFunction: () => this.deleteStory(story)
  //     }
  //   });
  // };

  // public deleteStory(story: StoryInterface) {
  //   console.log(`LOL: Deleting story: ${story.name}: ${story.id}`);
  //   this.dbService.deleteDocument<StoryInterface>(COLLECTION_NAMES.STORIES, story.id);
  // }

  public cleanup() {
    this.dbService.cleanupCollection(COLLECTION_NAMES.STORIES);
    this.dbService.cleanupCollection(COLLECTION_NAMES.CHAPTERS);
    console.log(`LOL: Running ceanup for collections: ${COLLECTION_NAMES.STORIES}, ${COLLECTION_NAMES.CHAPTERS}`);
  }
}
