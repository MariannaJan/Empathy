import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, Validators, NonNullableFormBuilder } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from 'src/app/services/auth-service/auth.service';
import { CreatePasswordFormFragmentComponent } from '../form-fragments/create-password/create-password-form-fragment/create-password-form-fragment.component';

@Component({
  selector: 'registration',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    CreatePasswordFormFragmentComponent,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  private formBuilder = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  public registerForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: [{ password1: '', password2: '' }],
  });

  public async register() {
    if (this.registerForm.value.email && this.registerForm.value.password?.password1) {
      this.authService.registerUser(this.registerForm.value.email, this.registerForm.value.password.password1)
        .then((userCredentials) => {
          console.log(`LOL: User registered: ${userCredentials.user.email}`);
          this.snackBar.open('User registered.', 'Dismiss');
          this.router.navigate(['/library']);
        })
        .catch((e) => {
          console.log(`LOL: Error on registration: ${e}`);
          this.snackBar.open('Failed to register the user', 'Dismiss')
        })
    } else {
      throw new Error('LOL: Error on registration: Missing email.');
    }
  }
}
