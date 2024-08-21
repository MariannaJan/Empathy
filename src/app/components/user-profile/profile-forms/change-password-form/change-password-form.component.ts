import { Component, Input, inject } from '@angular/core';
import { ReactiveFormsModule, Validators, NonNullableFormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreatePasswordFormFragmentComponent } from 'src/app/components/form-fragments/create-password/create-password-form-fragment/create-password-form-fragment.component';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'change-password-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    CreatePasswordFormFragmentComponent,
  ],
  templateUrl: './change-password-form.component.html',
  styleUrl: './change-password-form.component.scss'
})
export class ChangePasswordFormComponent {

  @Input() email!: string | null;
  private authService = inject(AuthService);
  private formBuilder = inject(NonNullableFormBuilder);
  private snackBar = inject(MatSnackBar);

  public changePasswordForm = this.formBuilder.group({
    currentPassword: ['', Validators.required],
    newPassword: [{ password1: '', password2: '' }],
  });

  public async changePassword() {
    if (this.changePasswordForm.value.newPassword && this.changePasswordForm.value.currentPassword)
      await this.authService.changeUserPassword(
        this.changePasswordForm.value.newPassword.password1, this.changePasswordForm.value.currentPassword)
        .then(() => {
          console.log(`LOL: Password changed succesfully for user: ${this.email}`);
          this.changePasswordForm.patchValue({
            currentPassword: '',
            newPassword: { password1: '', password2: '' },
          });
          this.snackBar.open('Password succesfully changed', 'Ok');
        })
        .catch((e) => {
          console.log(`LOL: Error on password change: ${e}`);
          this.snackBar.open('Failed to change the password', 'Ok');
        });
  }
}
