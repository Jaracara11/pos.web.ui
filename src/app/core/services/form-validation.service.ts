import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormValidationService {
  constructor(private formBuilder: FormBuilder) { }

  createAuthForm(): FormGroup {
    return this.formBuilder.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(25),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(25),
        ],
      ],
    });
  }

  getAuthErrorMessage(authForm: FormGroup, fieldName: string): string | null {
    const field = authForm.get(fieldName);

    if (field && this.isInputInvalid(field)) {
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
          }
        }
      }
    }
    return null;
  }

  private isInputInvalid(field: AbstractControl): boolean {
    return field && field.invalid && (field.dirty || field.touched);
  }
}
