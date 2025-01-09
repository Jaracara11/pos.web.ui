import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormValidationService {
  constructor(private fb: FormBuilder) { }

  createAuthForm(): FormGroup {
    return this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]],
    });
  }

  createPasswordChangeForm(): FormGroup {
    return this.fb.group({
      oldPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]],
      newPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]],
      repeatNewPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]],
    }, { validators: this.passwordsMatchValidator() });
  }

  upsertProductForm(): FormGroup {
    return this.fb.group({
      productID: [0, [Validators.required, Validators.min(0)]],
      productName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      productDescription: ['', Validators.maxLength(100)],
      productStock: [0, [Validators.required, Validators.min(0)]],
      productCost: [0, [Validators.required, Validators.min(0.01)]],
      productPrice: [0, [Validators.required, Validators.min(0.01)]],
      discount: [0, Validators.min(0.00)],
      productCategory: [null, Validators.required],
    });
  }

  getFieldErrorMessage(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);

    if (field && field.touched && field.errors) {
      return this.getErrorMessage(fieldName, field.errors);
    }
    return '';
  }

  private getErrorMessage(fieldName: string, errors: ValidationErrors): string {
    const messages: Record<string, string> = {
      required: `${fieldName} is required or it's value is invalid.`,
      minlength: `${fieldName} should be at least ${errors['minlength']?.requiredLength} characters long.`,
      maxlength: `${fieldName} cannot exceed ${errors['maxlength']?.requiredLength} characters.`,
      min: `${fieldName} must be at least ${errors['min']?.min}.`,
      passwordsMismatch: 'Passwords do not match.',
      newPasswordSameAsOld: 'New password cannot be the same as the old password.',
    };

    return Object.keys(errors).map(key => messages[key] || '').find(Boolean) || '';
  }

  private passwordsMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const { newPassword, repeatNewPassword, oldPassword } = group.value;
      const errors: ValidationErrors = {};

      if (newPassword !== repeatNewPassword) errors['passwordsMismatch'] = true;
      if (oldPassword && newPassword === oldPassword) errors['newPasswordSameAsOld'] = true;

      return Object.keys(errors).length ? errors : null;
    };
  }
}