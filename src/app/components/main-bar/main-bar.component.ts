import { Observable, map } from 'rxjs';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from 'src/app/services/auth-service/auth.service';


import { isDevMode } from '@angular/core';

@Component({
  selector: 'main-bar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
  ],
  templateUrl: './main-bar.component.html',
  styleUrl: './main-bar.component.scss'
})
export class MainBarComponent {

  public userName$: Observable<string | null>;
  public isKnownUser$: Observable<boolean>;

  constructor(
    private authService: AuthService
  ) {
    this.userName$ = this.authService.user$.pipe(
      map((user) => {
        if (!user) {
          return 'Signed Out';
        }
        return user.isAnonymous ? 'Guest' : (user?.displayName || user.email);
      })
    );

    this.isKnownUser$ = this.authService.user$.pipe(
      map((user) => (user && !user.isAnonymous) || isDevMode())
    );
  }
}
