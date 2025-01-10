import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormValidationService {
  constructor(private fb: FormBuilder) { }

  createAuthForm(): FormGroup {
    return this.fb.group({
      username: ['', this.commonInputValidators(3, 25)],
      password: ['', this.commonInputValidators(4, 25)],
    });
  }

  createPasswordChangeForm(): FormGroup {
    return this.fb.group({
      oldPassword: ['', this.commonInputValidators(4, 25)],
      newPassword: ['', this.commonInputValidators(4, 25)],
      repeatNewPassword: ['', this.commonInputValidators(4, 25)],
    }, { validators: this.passwordsMatchValidator() });
  }

  upsertProductForm(): FormGroup {
    return this.fb.group({
      productID: [0, [Validators.required, Validators.min(0), this.integerValidator()]],
      productName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      productDescription: ['', Validators.maxLength(100)],
      productStock: [0, [Validators.required, Validators.min(0), this.integerValidator()]],
      productCost: [0, [Validators.required, Validators.min(0), this.currencyValidator()]],
      productPrice: [0, [Validators.required, Validators.min(0), this.currencyValidator()]],
      discount: [0, [Validators.min(0), this.currencyValidator()]],
      productCategory: [null, Validators.required],
    });
  }

  private commonInputValidators(minLength: number, maxLength: number): ValidatorFn[] {
    return [
      Validators.required,
      Validators.minLength(minLength),
      Validators.maxLength(maxLength)
    ];
  }

  private integerValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valid = /^[0-9]*$/.test(control.value);
      return valid ? null : { integer: true };
    };
  }

  private currencyValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valid = /^[0-9]+(\.[0-9]{1,2})?$/.test(control.value);
      return valid ? null : { currency: true };
    };
  }

  getFieldErrorMessage(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);
    if (field?.touched) {
      const errors = field.errors;
      if (errors) {
        return Object.keys(errors).map(key => {
          let message = this.errorMessages[key] || `Invalid ${fieldName}.`;
          if (typeof errors[key] === 'object') {
            Object.keys(errors[key]).forEach(subKey => {
              const errorValue = errors[key][subKey];
              if (errorValue !== undefined) {
                message = message.replace(new RegExp(`{{${subKey}}}`, 'g'), String(errorValue));
              }
            });
          }
          return message;
        }).join(' ');
      }
    }
    return '';
  }

  private passwordsMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const pass = group.get('newPassword')?.value || '';
      const confirmPass = group.get('repeatNewPassword')?.value || '';
      const oldPass = group.get('oldPassword')?.value || '';

      if (pass !== confirmPass) return { passwordsMismatch: true };
      if (oldPass && pass === oldPass) return { newPasswordSameAsOld: true };
      return null;
    };
  }

  private errorMessages: Record<string, string> = {
    'required': 'This field is required.',
    'minlength': 'Should be at least {{requiredLength}} characters long.',
    'maxlength': 'Cannot exceed {{requiredLength}} characters.',
    'min': 'Must be at least {{min}}.',
    'pattern': 'Only numbers are allowed.',
    'passwordsMismatch': 'Passwords do not match.',
    'newPasswordSameAsOld': 'New password cannot be the same as the old password.',
    'integer': 'Only integers are allowed.',
    'currency': 'Must be a valid currency amount.'
  };
}