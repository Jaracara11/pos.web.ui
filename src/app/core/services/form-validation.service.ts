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
    return this.formBuilder.group({
      oldPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]],
      newPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]],
      repeatNewPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]],
    },
      {
        validators: [this.passwordsMatchValidator()],
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
              return `New passwords do not match.`;
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
      const oldPassword = group.get('oldPassword')?.value;
      const errors: ValidationErrors = {};

      if (newPassword !== repeatNewPassword) {
        errors['passwordsMismatch'] = true;
      }

      if (oldPassword && newPassword && oldPassword === newPassword) {
        errors['newPasswordSameAsOld'] = true;
      }

      return Object.keys(errors).length !== 0 ? errors : null;
    };
  }

  private isFieldInvalid(field: AbstractControl): boolean {
    return field && field.invalid && (field.dirty || field.touched);
  }
}