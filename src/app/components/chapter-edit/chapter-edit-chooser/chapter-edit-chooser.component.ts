import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';

import { ChapterEditFormComponent } from '../chapter-edit-form/chapter-edit-form.component';
import { DbService } from 'src/app/services/db-service/db-service.service';
import { COLLECTION_NAMES } from 'src/app/services/db-service/db-settings';
import { ChapterInterface } from 'src/app/models/chapter.interface';
import { RxDocument } from 'rxdb';
import { Observable } from 'rxjs';


@Component({
  selector: 'chapter-edit-chooser',
  standalone: true,
  imports: [
    CommonModule,
    ChapterEditFormComponent,
  ],
  templateUrl: './chapter-edit-chooser.component.html',
  styleUrl: './chapter-edit-chooser.component.scss'
})
export class ChapterEditChooserComponent {

  @Input() chapterId!: string;
  public chapter$: Promise<Observable<RxDocument<ChapterInterface>>>;

  private dbService = inject(DbService);
  constructor() {
    this.chapter$ = this.dbService.getDocumentById<ChapterInterface>(COLLECTION_NAMES.CHAPTERS, this.chapterId);
  }

  ngOnInit() {
    this.chapter$ = this.dbService.getDocumentById<ChapterInterface>(COLLECTION_NAMES.CHAPTERS, this.chapterId);
  }


}
