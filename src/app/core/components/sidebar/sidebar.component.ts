import { Component, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserInfo } from '../../../shared/interfaces/user-Info.interface';
import { FormValidationService } from '../../services/form-validation.service';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordChangeModalComponent } from '../password-change-modal/password-change-modal.component';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, FormsModule, ReactiveFormsModule, PasswordChangeModalComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @ViewChild(PasswordChangeModalComponent) passwordChangeModal!: PasswordChangeModalComponent;
  validateRolePermission: boolean;
  user: UserInfo | null;
  passwordChangeForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formValidationService: FormValidationService) {
    this.user = this.authService.getAuthInfo();
    this.validateRolePermission = this.authService.validateUserRolePermission(['Admin', 'Manager']);
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