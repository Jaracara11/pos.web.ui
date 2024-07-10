import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserInfo } from '../../../shared/interfaces/user-Info.interface';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  userPagePermission: boolean;
  user: UserInfo;

  constructor(private authService: AuthService, private router: Router) {
    this.user = this.authService.getUserInfo();
    this.userPagePermission = this.authService.validateUserRolePermission(['Admin', 'Manager']);
  }

  signOut(): void {
    localStorage.removeItem('user');
    this.router.navigateByUrl('/auth');
  }
}