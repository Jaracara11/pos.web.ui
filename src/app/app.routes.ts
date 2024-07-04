import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { AuthComponent } from './features/auth/auth.component';
import { authGuard } from './core/guards/auth.guard';
import { InvoiceComponent } from './features/invoice/invoice.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'auth', component: AuthComponent },
  { path: 'invoice/:orderID', component: InvoiceComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
