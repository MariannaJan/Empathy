import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'account-delete-confirmation',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './account-delete-confirmation.component.html',
  styleUrl: './account-delete-confirmation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class AccountDeleteConfirmationComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { deleteFunction: CallableFunction }) { }
}
