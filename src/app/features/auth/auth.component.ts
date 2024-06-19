import { Component } from '@angular/core';
import { UserAuth } from '../../shared/interfaces/user-auth.interface';
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormValidationService } from '../../core/services/form-validation.service';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  authForm: FormGroup;
  user: UserAuth = {
    username: '',
    password: '',
  };

  constructor(private formValidationService: FormValidationService) {
    this.authForm = this.formValidationService.createAuthForm();
  }

  ngOnInit(): void { }

  getAuthErrorMessage(fieldName: string): string | null {
    return this.formValidationService.getAuthErrorMessage(this.authForm, fieldName);
  }

  onSubmit(): void {
    if (this.authForm.valid) {
      this.user = this.authForm.value;
      console.log(this.user);
    }
  }
}
