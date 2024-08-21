import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'change-email-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './change-email-form.component.html',
  styleUrl: './change-email-form.component.scss'
})
export class ChangeEmailFormComponent {

  private formBuilder = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  public changeEmailForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  public async changeEmail() {
    if (this.changeEmailForm.value.email && this.changeEmailForm.value.password) {
      await this.authService.changeUserEmail(this.changeEmailForm.value.email, this.changeEmailForm.value.password)
        .then(() => {
          console.log('LOL: Email soccesfully changed');
          this.snackBar.open('Email succesfully changed', 'Ok');
        })
        .catch((e) => {
          console.log(`LOL: Error on email change: ${e}`);
          this.snackBar.open('Failed to change the email', 'Ok');
        });
    } else {
      throw new Error('LOL: Error on email change - missing new email or password');
    }
  }
}
