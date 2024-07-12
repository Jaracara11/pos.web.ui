import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidationErrors,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormValidationService {
  constructor(private formBuilder: FormBuilder) { }

  createAuthForm(): FormGroup {
    return this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]],
    });
  }

  createPasswordChangeForm(): FormGroup {
    return this.formBuilder.group(
      {
        oldPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]],
        newPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]],
        repeatNewPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]],
      },
      {
        validators: [this.passwordsMatchValidator(), this.newPasswordNotSameAsOldValidator()],
      }
    );
  }

  getErrorMessage(form: FormGroup, fieldName: string): string | null {
    const field = form.get(fieldName);

    if (field && this.isFieldInvalid(field)) {
      const errors = field.errors as ValidationErrors;

      for (const errorType in errors) {
        if (errors.hasOwnProperty(errorType)) {
          switch (errorType) {
            case 'required':
              return `${fieldName} is required.`;
            case 'minlength':
              return `${fieldName} cannot have less than ${errors['minlength'].requiredLength} characters.`;
            case 'maxlength':
              return `${fieldName} cannot exceed ${errors['maxlength'].requiredLength} characters.`;
            case 'passwordsMismatch':
              return `New password do not match.`;
            case 'newPasswordSameAsOld':
              return `New password cannot be the same as the old password.`;
          }
        }
      }
    }
    return null;
  }

  private passwordsMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const newPassword = group.get('newPassword')?.value;
      const repeatNewPassword = group.get('repeatNewPassword')?.value;
      return newPassword !== repeatNewPassword ? { passwordsMismatch: true } : null;
    };
  }

  private newPasswordNotSameAsOldValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const oldPassword = group.get('oldPassword')?.value;
      const newPassword = group.get('newPassword')?.value;
      const isSameAsOld = oldPassword && newPassword && oldPassword === newPassword;
      return isSameAsOld ? { newPasswordSameAsOld: true } : null;
    };
  }

  private isFieldInvalid(field: AbstractControl): boolean {
    return field && field.invalid && (field.dirty || field.touched);
  }
}