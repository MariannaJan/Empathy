import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { ReactiveFormsModule, Validators, NonNullableFormBuilder } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';


import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'sign-in',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {

  public hide: boolean = true;

  private formBuilder = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  public loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  public async login() {
    if (this.loginForm.value.email && this.loginForm.value.password) {
      await this.authService.loginWithEmail(
        this.loginForm.value.email,
        this.loginForm.value.password
      )
        .then((UserCredential) => {
          console.log(`LOL: Signed in user: ${UserCredential.user.email}`);
          this.router.navigate(['/library']);
        })
        .catch((e) => {
          console.log(`LOL: Error on login: ${e}`);
          this.snackBar.open('Incorrect email or password', 'Dismiss')
        });
    } else {
      throw new Error('LOL: Error on login: Missing email or password');
    }
  }

  public async resetPassword() {
    if (this.loginForm.value.email && !this.loginForm.get('email')?.errors) {
      await this.authService.resetPassword(this.loginForm.value.email);
      this.snackBar.open(`Password reset email sent to ${this.loginForm.value.email}`, 'Dismiss');
    } else {
      this.snackBar.open('Enter correct email', 'Dismiss');
    }
  }

}
