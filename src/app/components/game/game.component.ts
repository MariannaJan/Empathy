import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import PouchDB from 'pouchdb';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  private db: PouchDB.Database;

  constructor() {
    this.db = new PouchDB('firstDb');
    this.db.info().then(function (info) {
      console.log(info);
    });
    this.db
      .put({
        _id: 'lol',
        name: 'iza',
      })
      .catch(err => {
        if (err.name === 'conflict') {
          console.log('conflict');
        } else {
          throw err;
        }
      });
  }
}
