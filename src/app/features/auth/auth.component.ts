import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UserAuth } from '../../shared/interfaces/user-auth.interface';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatInputModule, MatButtonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  user: UserAuth = {
    username: '',
    password: '',
  };

  constructor() {}

  onSubmit(): void {
    console.log('Username:', this.user.username);
    console.log('Password:', this.user.password);
  }
}
