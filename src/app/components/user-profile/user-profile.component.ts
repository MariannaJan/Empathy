import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import {
  MatAccordion,
  MatExpansionModule
} from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';

import { User } from 'firebase/auth';
import { DisplayNameFormComponent } from './profile-forms/display-name-form/display-name-form.component';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { ChangePasswordFormComponent } from './profile-forms/change-password-form/change-password-form.component';
import { ChangeEmailFormComponent } from './profile-forms/change-email-form/change-email-form.component';
import { DeleteAccountFormComponent } from './profile-forms/delete-account-form/delete-account-form.component';
import { ProviderType } from 'src/app/models/provider.type';

@Component({
  selector: 'user-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatAccordion,
    MatExpansionModule,
    MatIconModule,
    MatListModule,
    DisplayNameFormComponent,
    ChangePasswordFormComponent,
    ChangeEmailFormComponent,
    DeleteAccountFormComponent,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  @Input() public authUser!: User | null;

  public showDeleteForm = false;
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  public provider: ProviderType | null = null;

  ngOnInit() {
    this.provider = this.authUser?.providerData[0].providerId as ProviderType || null;
    console.log(`LOL provider: ${this.provider}`)
  }

  public async verifyEmail() {
    await this.authService.verifyEmail()
      .then((email) => {
        console.log(`LOL: Verification email sent to ${email}`);
        this.snackBar.open(`Verification email sent to ${email}`, 'Ok');
      })
      .catch((e) => {
        console.log(`LOL: Error on sending verification email: ${e}`);
        this.snackBar.open('Failed sending verification email', 'Ok');
      })
  }
}
