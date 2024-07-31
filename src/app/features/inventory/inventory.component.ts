import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent {
  validateRolePermission: boolean;

  constructor(private authService: AuthService) {
    this.validateRolePermission = this.authService.validateUserRolePermission(['Admin', 'Manager']);
  }
}
