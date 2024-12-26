import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidationErrors,
  AbstractControl,
  ValidatorFn,
  FormControl,
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
      productStock: [0, [Validators.required, Validators.min(0), this.numericValidator()]],
      productCost: [0, [Validators.required, Validators.min(0.01), this.numericValidator()]],
      productPrice: [0, [Validators.required, Validators.min(0.01), this.numericValidator()]],
      productCategory: [null, [Validators.required, this.categorySelectedValidator()]],
    });
  }

  getFieldErrorMessage(form: FormGroup, fieldName: string): string | null {
    const field = form.get(fieldName);
    if (field && this.isFieldInvalid(field)) {
      console.log(field.errors)
      const error = Object.keys(field.errors || {})[0];
      return this.getErrorMessage(fieldName, error, field.errors?.[error]);
    }
    return null;
  }

  private getErrorMessage(fieldName: string, errorType: string, errorValue?: ValidationErrors): string {
    const errorMessages: Record<string, string> = {
      required: `${this.formatFieldName(fieldName)} is required.`,
      minlength: `${this.formatFieldName(fieldName)} cannot have less than ${errorValue?.['requiredLength']} characters.`,
      maxlength: `${this.formatFieldName(fieldName)} cannot exceed ${errorValue?.['requiredLength']} characters.`,
      min: `${this.formatFieldName(fieldName)} must be at least ${errorValue?.['min']}.`,
      invalidNumber: `${this.formatFieldName(fieldName)} must be a valid number.`,
    };
    return errorMessages[errorType] || '';
  }

  private getRequiredField(minLength: number, maxLength: number): FormControl {
    return this.formBuilder.control('', Validators.compose([
      Validators.required,
      Validators.minLength(minLength),
      Validators.maxLength(maxLength)
    ]));
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

  private numericValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return isNaN(Number(control.value)) ? { invalidNumber: true } : null;
    };
  }

  private formatFieldName(fieldName: string): string {
    const fieldNames: Record<string, string> = {
      productID: 'Product ID',
      productName: 'Product Name',
      productDescription: 'Product Description',
      productStock: 'Product Stock',
      productCost: 'Product Cost',
      productPrice: 'Product Price',
      productCategory: 'Product Category',
    };
    return fieldNames[fieldName] || fieldName;
  }
}