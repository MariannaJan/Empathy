import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { PasswordLength } from 'src/app/components/form-fragments/create-password/create-password-form-fragment/create-password-form-fragment.component';

@Component({
  selector: 'password-requirements-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatListModule,
    MatButtonModule,
  ],
  templateUrl: './password-requirements-dialog.component.html',
  styleUrl: './password-requirements-dialog.component.scss'
})
export class PasswordRequirementsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: typeof PasswordLength) { }
}
