import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
-0
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from 'src/app/services/auth-service/auth.service';


@Component({
  selector: 'start',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
  ],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss'
})
export class StartComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  public guestLogin() {
    this.authService.anonymousLogin()
      .then(() => {
        console.log('LOL: Logging in as guest');
        this.router.navigate(['/library']);
      });
  }

  public googleLogin() {
    this.authService.googleLogin()
      .then(() => {
        console.log(`LOL: Login via google`);
        this.router.navigate(['/library']);
      });
  }
}
