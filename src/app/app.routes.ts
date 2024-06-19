import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { AuthComponent } from './features/auth/auth.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'auth', component: AuthComponent },
  { path: '**', redirectTo: '' }
];
