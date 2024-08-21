import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators, NonNullableFormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from 'src/app/services/auth-service/auth.service';


@Component({
  selector: 'display-name-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './display-name-form.component.html',
  styleUrl: './display-name-form.component.scss'
})
export class DisplayNameFormComponent {

  private formBuilder = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  public displayNameForm = this.formBuilder.group({
    displayName: ['', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(20)]
    ]
  });

  public async changeDisplayName() {
    if (this.displayNameForm.value.displayName) {
      await this.authService.updateUserProfile(this.displayNameForm.value.displayName)
        .then(() => {
          console.log(`LOL: Changed display name to: ${this.displayNameForm.value.displayName}`);
          this.snackBar.open('Display name changed.', 'Ok');

        })
        .catch((e) => {
          this.snackBar.open('Failed to update display name.', 'Ok');
          console.log(`LOL: Error on setting display name: ${e}`);
        });
      ;

    }
  }

}
