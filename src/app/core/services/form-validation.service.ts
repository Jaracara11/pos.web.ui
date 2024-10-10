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
      username: this.getRequiredField(3, 25),
      password: this.getRequiredField(4, 25),
    });
  }

  createPasswordChangeForm(): FormGroup {
    return this.formBuilder.group(
      {
        oldPassword: this.getRequiredField(4, 25),
        newPassword: this.getRequiredField(4, 25),
        repeatNewPassword: this.getRequiredField(4, 25),
      },
      { validators: [this.passwordsMatchValidator()] }
    );
  }

  upsertProductForm(): FormGroup {
    return this.formBuilder.group({
      productID: ['', [Validators.minLength(3), Validators.maxLength(50)]],
      productName: this.getRequiredField(3, 50),
      productDescription: ['', [Validators.maxLength(100)]],
      productStock: [0, [Validators.required, Validators.min(0)]],
      productCost: [0, [Validators.required, Validators.min(0.01)]],
      productPrice: [0, [Validators.required, Validators.min(0.01)]],
      productCategory: [null, [Validators.required, this.categorySelectedValidator()]],
    });
  }

  getFieldErrorMessage(form: FormGroup, fieldName: string): string | null {
    const field = form.get(fieldName);
    if (field && this.isFieldInvalid(field)) {
      const error = Object.keys(field.errors || {})[0];
      return this.getErrorMessage(fieldName, error, field.errors?.[error]);
    }
    return null;
  }

  private getErrorMessage(fieldName: string, errorType: string, errorValue?: ValidationErrors): string {
    const errorMessages: Record<string, string> = {
      required: `${fieldName} is required.`,
      minlength: `${fieldName} cannot have less than ${errorValue?.['requiredLength']} characters.`,
      maxlength: `${fieldName} cannot exceed ${errorValue?.['requiredLength']} characters.`,
      min: `${fieldName} cannot be a negative number.`,
    };
    return errorMessages[errorType] || '';
  }

  private getRequiredField(minLength: number, maxLength: number) {
    return ['', [Validators.required, Validators.minLength(minLength), Validators.maxLength(maxLength)]];
  }

  private isFieldInvalid(field: AbstractControl): boolean {
    return field.invalid && (field.dirty || field.touched);
  }

  private passwordsMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const newPassword = group.get('newPassword')?.value;
      const repeatNewPassword = group.get('repeatNewPassword')?.value;
      const oldPassword = group.get('oldPassword')?.value;

      const errors: ValidationErrors = {};
      if (newPassword !== repeatNewPassword) errors['passwordsMismatch'] = true;
      if (oldPassword && newPassword === oldPassword) errors['newPasswordSameAsOld'] = true;

      return Object.keys(errors).length ? errors : null;
    };
  }

  private categorySelectedValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value ? null : { required: true };
    };
  }
}