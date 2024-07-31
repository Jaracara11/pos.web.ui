import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { AuthComponent } from './features/auth/auth.component';
import { authGuard } from './core/guards/auth.guard';
import { InvoiceComponent } from './features/invoice/invoice.component';
import { InventoryComponent } from './features/inventory/inventory.component';

export const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'invoice/:orderID', component: InvoiceComponent, canActivate: [authGuard] },
  { path: 'inventory', component: InventoryComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
