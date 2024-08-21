import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';

import { DbService } from 'src/app/services/db-service/db-service.service';
import { StoryInterface } from 'src/app/models/story.interface';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { COLLECTION_NAMES } from 'src/app/services/db-service/db-settings';
import { BehaviorSubject } from 'rxjs';
import { RxDocument } from 'rxdb';

@Component({
  selector: 'editor-stories',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
  ],
  templateUrl: './editor-stories.component.html',
  styleUrl: './editor-stories.component.scss'
})
export class EditorStoriesComponent {

  private dbService = inject(DbService);
  private dialog = inject(MatDialog);

  public stories$ = this.getStories();

  public async getStories(): Promise<BehaviorSubject<StoryInterface[]>> {
    return await this.dbService.getAllCollectionDocs<StoryInterface>(
      COLLECTION_NAMES.STORIES
    );
  }

  public addStory(
    newStory: Omit<StoryInterface, 'id'>,
  ): Promise<RxDocument<StoryInterface>> {
    return this.dbService.addDocument<StoryInterface>(
      COLLECTION_NAMES.STORIES,
      newStory,
    );
  }

  public delete(story: StoryInterface) {
    this.dialog.open(DeleteConfirmationComponent, {
      data: {
        id: story.id,
        name: story.name,
        collection: COLLECTION_NAMES.STORIES,
        deleteFunction: () => this.deleteStory(story),
      }
    });
  };

  public deleteStory(story: StoryInterface) {
    console.log(`LOL: Deleting story: ${story.name}: ${story.id}`);
    this.dbService.deleteDocument<StoryInterface>(COLLECTION_NAMES.STORIES, story.id);
  }


}
