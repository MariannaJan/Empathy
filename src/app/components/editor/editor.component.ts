import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  InsertStoryInterface,
  StoryInterface,
} from 'src/app/models/story.interface';
import { DbService } from 'src/app/services/db-service/db-service.service';
import { COLLECTION_NAMES } from 'src/app/services/db-service/db-settings';

@Component({
  selector: 'editor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
})
export class EditorComponent {
  public stories$ = this.getStories();

  constructor(public dbService: DbService) { }

  public addStory(): Promise<StoryInterface> {
    const newStory: InsertStoryInterface = {
      name: 'NewStory',
      is_premium: false,
      languages: ['en'],
    };

    return this.dbService.addStory(newStory).then(lol => {
      console.log(`LOL insert result: ${JSON.stringify(lol)}`);
      return lol;
    });
  }
  public getStories() {
    return this.dbService.getStories();
  }

  public replicate() {
    this.dbService.replicateCollection(COLLECTION_NAMES.STORIES);
  }
}
