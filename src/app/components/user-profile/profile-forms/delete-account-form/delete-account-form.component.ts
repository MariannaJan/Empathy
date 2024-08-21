import { Component, Input, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { AuthService } from 'src/app/services/auth-service/auth.service';
import { AccountDeleteConfirmationComponent } from '../account-delete-confirmation/account-delete-confirmation.component';
import { ProviderType } from 'src/app/models/provider.type';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'delete-account-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './delete-account-form.component.html',
  styleUrl: './delete-account-form.component.scss'
})
export class DeleteAccountFormComponent {

  @Input() provider!: ProviderType;
  private authService = inject(AuthService);
  private formBuilder = inject(NonNullableFormBuilder);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  public deleteAccountForm = this.formBuilder.group({
    password: ['', Validators.required],
  });

  public showDeleteDialog() {
    this.dialog.open(AccountDeleteConfirmationComponent, {
      data: {
        deleteFunction: () => this.deleteAccount(),
      }
    })
  }

  public async deleteAccount() {
    if (this.provider === 'password' && !this.deleteAccountForm.value.password) {
      throw new Error('LOL: Error on deleting account - missing password');
    }
    await this.authService.deleteAccount(this.provider, this.deleteAccountForm.value.password)
      .then(() => {
        console.log(`LOL: Delete account`);
        this.router.navigate(['']);
        this.snackBar.open('Account succesfully deleted', 'Ok');
      })
      .catch((e) => {
        console.log(`LOL: There was an arror on account deletion: ${e}`);
        this.snackBar.open('Failed to delete account', 'Ok');
      });
  }
}
