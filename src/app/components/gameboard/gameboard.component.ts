import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';

import { DbService } from 'src/app/services/db-service/db-service.service';
import { COLLECTION_NAMES } from 'src/app/services/db-service/db-settings';
import { ChapterInterface } from 'src/app/models/chapter.interface';
import { GameTextComponent } from '../game-text/game-text.component';


@Component({
  selector: 'app-gameboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    GameTextComponent,
  ],
  templateUrl: './gameboard.component.html',
  styleUrl: './gameboard.component.scss'
})
export class GameboardComponent {

  @Input() chapterId!: string;
  private dbService = inject(DbService);

  public text: string;
  public chapter$ = this.dbService.getDocumentById<ChapterInterface>(COLLECTION_NAMES.CHAPTERS, this.chapterId);

  constructor() {
    this.text = `This defines 5e0f2bd0-2b43-4df3-9542-1d4969e24f87 the ability for a flex item to grow if necessary. It accepts a unitless value that serves as a proportion. It dictates what amount of the available space inside the flex container the item should take up.

If all items have flex-grow set to 1, the fb506849-9ef5-4771-a1c0-508460bf16ce remaining space in the container will be distributed equally to all children. If one of the children has a value of 2, that child would take up twice as much of the space as either one of the others (or it will try, at least).`
  }

  ngOnInit() {
    this.chapter$ = this.dbService.getDocumentById<ChapterInterface>(COLLECTION_NAMES.CHAPTERS, this.chapterId);
  }

  lol(chap: string | undefined) {
    return () => console.log(`LOL pipe ${chap}`);
  }

  public buildRefs(refs: any[]) {
    return () => {

    }
  }

}
