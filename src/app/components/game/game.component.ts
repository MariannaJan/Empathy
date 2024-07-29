import { DbService } from './../../services/db-service/db-service.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {

  constructor(
    public dbService: DbService,
  ) { }

  public getStories() {
    this.dbService.getStories();
  }

}