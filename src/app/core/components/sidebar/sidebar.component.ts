import { Component, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserInfo } from '../../../shared/interfaces/user-Info.interface';
import { FormValidationService } from '../../services/form-validation.service';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { PasswordChangeModalComponent } from '../password-change-modal/password-change-modal.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule, ReactiveFormsModule, LoadingSpinnerComponent, PasswordChangeModalComponent, AsyncPipe],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  @ViewChild(PasswordChangeModalComponent) passwordChangeModal!: PasswordChangeModalComponent;
  userPagePermission: boolean;
  user: UserInfo;
  passwordChangeForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formValidationService: FormValidationService) {
    this.user = this.authService.getAuthInfo();
    this.userPagePermission = this.authService.validateUserRolePermission(['Admin', 'Manager']);
    this.passwordChangeForm = this.formValidationService.createPasswordChangeForm();
  }

  signOut(): void {
    localStorage.removeItem('user');
    this.router.navigateByUrl('/auth');
  }

  openChangePasswordModal(): void {
    this.passwordChangeModal.openModal();
  }
}