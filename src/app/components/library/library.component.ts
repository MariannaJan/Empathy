import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { StoryInterface } from 'src/app/models/story.interface';
import { Observable } from 'rxjs';


@Component({
  selector: 'library',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule
  ],
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
})
export class LibraryComponent {

  @Input() public stories$!: Observable<StoryInterface[]>;
}