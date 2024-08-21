import 'zone.js/plugins/zone-patch-rxjs';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainBarComponent } from '../main-bar/main-bar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [MainBarComponent, RouterOutlet],
})
export class AppComponent {
  constructor() { }
}
