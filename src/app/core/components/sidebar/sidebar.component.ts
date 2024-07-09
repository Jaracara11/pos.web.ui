import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {

  userPagePermission = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userPagePermission = this.authService.validateUserRolePermission(['Admin', 'Manager']);
  }
}