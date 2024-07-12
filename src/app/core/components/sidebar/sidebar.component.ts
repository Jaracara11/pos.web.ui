import { Component, TemplateRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
import { UserInfo } from '../../../shared/interfaces/user-Info.interface';
import { FormValidationService } from '../../services/form-validation.service';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { LoadingService } from '../../services/loading.service';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule, ReactiveFormsModule, LoadingSpinnerComponent, AsyncPipe],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  isSubmitting$: Observable<boolean>;
  userPagePermission: boolean;
  user: UserInfo;
  passwordChangeForm: FormGroup;
  showChangePasswordModal = false;
  closeResult = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal,
    private formValidationService: FormValidationService,
    private loadingService: LoadingService) {
    this.user = this.authService.getUserInfo();
    this.userPagePermission = this.authService.validateUserRolePermission(['Admin', 'Manager']);
    this.passwordChangeForm = this.formValidationService.createPasswordChangeForm();
    this.isSubmitting$ = loadingService.getLoadingState;
  }

  signOut(): void {
    localStorage.removeItem('user');
    this.router.navigateByUrl('/auth');
  }

  toggleChangePasswordModal(content: TemplateRef<any>): void {
    const modalOptions: NgbModalOptions = {
      centered: true,
      size: 'sm',
      windowClass: 'modal-centered'
    };

    this.modalService.open(content, modalOptions);
  }

  getPasswordErrorMessage(fieldName: string): string | null {
    return this.formValidationService.getErrorMessage(this.passwordChangeForm, fieldName);
  }

  onSubmit() {

  }
}