import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DbService } from './../../services/db-service/db-service.service';

import { MatCardModule } from '@angular/material/card';
import { StoryInterface } from 'src/app/models/story.interface';
import { BehaviorSubject } from 'rxjs';
import { COLLECTION_NAMES } from 'src/app/services/db-service/db-settings';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule
  ],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {

  public stories$ = this.getStories();

  constructor(
    public dbService: DbService,
  ) { }

  public async getStories(): Promise<BehaviorSubject<StoryInterface[]>> {
    return await this.dbService.getAllCollectionDocs<StoryInterface>(
      COLLECTION_NAMES.STORIES
    );
  }

}