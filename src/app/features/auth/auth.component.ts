import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { UserAuth } from '../../shared/interfaces/user-auth.interface';
import { FormValidationService } from '../../core/services/form-validation.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { SwalAlertService } from '../../core/services/swal-alert.service';
import { UserInfo } from '../../shared/interfaces/user-Info.interface';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { LoadingService } from '../../core/services/loading.service';

@Component({
    selector: 'app-auth',
    imports: [FormsModule, ReactiveFormsModule, AsyncPipe],
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.css'
})
export class AuthComponent {
  isLoading$: Observable<boolean>;
  authForm: FormGroup;
  user: UserAuth = {
    username: '',
    password: '',
  };

  constructor(
    private formValidationService: FormValidationService,
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService,
    private swalAlertService: SwalAlertService,
  ) {
    this.isLoading$ = loadingService.getLoadingState;
    this.authForm = this.formValidationService.createAuthForm();
  }

  getAuthErrorMessage(fieldName: string): string | null {
    return this.formValidationService.getFieldErrorMessage(this.authForm, fieldName);
  }

  onSubmit(): void {
    if (this.authForm.invalid) {
      this.swalAlertService.swalAlertWithTitle('Form Invalid', 'Please check the form fields for errors.', 'error');
      return;
    }

    this.authService.signIn(this.authForm.value).subscribe({
      next: (response: UserInfo) => {
        localStorage.setItem('user', JSON.stringify(response));
        this.router.navigateByUrl('');
      }
    });
  }
}