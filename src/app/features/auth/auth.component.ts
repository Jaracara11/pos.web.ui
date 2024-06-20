import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Component } from '@angular/core';
import { UserAuth } from '../../shared/interfaces/user-auth.interface';
import { FormValidationService } from '../../core/services/form-validation.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { SwalAlertService } from '../../core/services/swal-alert.service';
import { UserInfo } from '../../shared/interfaces/user-Info.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  authForm: FormGroup;
  isSubmitting = false;
  user: UserAuth = {
    username: '',
    password: '',
  };

  constructor(private formValidationService: FormValidationService, private authService: AuthService,
    private router: Router, private swalAlertService: SwalAlertService) {
    this.authForm = this.formValidationService.createAuthForm();
  }

  getAuthErrorMessage(fieldName: string): string | null {
    return this.formValidationService.getAuthErrorMessage(this.authForm, fieldName);
  }

  onSubmit(): void {
    if (this.authForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true
    this.authService.signIn(this.authForm.value).subscribe({
      next: (response: UserInfo) => {
        localStorage.setItem('user', JSON.stringify(response));
        this.router.navigateByUrl('');
      },
      error: (error: HttpErrorResponse) => {
        this.swalAlertService.swalAlertWithTitle(error.statusText, error.error.message, 'error');
        this.isSubmitting = false;
      },
    });
  }
}