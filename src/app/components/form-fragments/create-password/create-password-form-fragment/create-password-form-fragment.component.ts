import { Component, OnDestroy, inject } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NonNullableFormBuilder,
  ValidationErrors,
  Validator,
  Validators,
  ValidatorFn,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { PasswordRequirementsDialogComponent } from 'src/app/services/password-requirements-dialog/password-requirements-dialog.component';

export const confirmPasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  return control.value.password1 === control.value.password2
    ? null
    : { PasswordNoMatch: true };
};

// at least one uppercase letter and lowercase letter and number and special character
export const StrongPasswordRegx: RegExp = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

export const PasswordLength = {
  min: 8,
  max: 20,
};

@Component({
  selector: 'create-password-form-fragment',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './create-password-form-fragment.component.html',
  styleUrl: './create-password-form-fragment.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: CreatePasswordFormFragmentComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: CreatePasswordFormFragmentComponent
    },
  ]
})
export class CreatePasswordFormFragmentComponent implements ControlValueAccessor, OnDestroy, Validator {

  private formBuilder = inject(NonNullableFormBuilder);
  private dialog = inject(MatDialog);

  public createPasswordForm = this.formBuilder.group({
    password1: ['',
      [
        Validators.required,
        Validators.minLength(PasswordLength.min),
        Validators.maxLength(PasswordLength.max),
        Validators.pattern(StrongPasswordRegx),
      ]
    ],
    password2: ['', Validators.required],
  },
    { validators: [confirmPasswordValidator] }
  );

  public onTouched: Function = () => { };

  public onChangeSubs: Subscription[] = [];

  ngOnDestroy(): void {
    this.onChangeSubs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    if (this.createPasswordForm.valid) {
      return null;
    }
    let errors = {};
    if (this.createPasswordForm.errors) {
      errors = { ... this.createPasswordForm.errors }
    }
    if (this.createPasswordForm.get('password1')?.errors) {
      errors = { ... this.createPasswordForm.get('password1')?.errors }
    }
    if (this.createPasswordForm.get('password2')?.errors) {
      errors = { ... this.createPasswordForm.get('password2')?.errors }
    }
    return errors;
  }

  writeValue(value: any): void {
    if (value) {
      this.createPasswordForm.setValue(value, { emitEvent: false });
    }
  }
  registerOnChange(onChange: any): void {
    const sub = this.createPasswordForm.valueChanges.subscribe(onChange);
    this.onChangeSubs.push(sub);
  }
  registerOnTouched(onTouched: Function): void {
    this.onTouched = onTouched;
  }
  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.createPasswordForm.disable() : this.createPasswordForm.enable();
  }

  public showRequirements() {
    const requirementsDialog = this.dialog.open(PasswordRequirementsDialogComponent, {
      data: {
        ...PasswordLength
      }
    });
  }

}
