import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingService } from './core/services/loading.service';
import { LoadingSpinnerComponent } from './core/components/loading-spinner/loading-spinner.component';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { LayoutComponent } from './core/components/layout/layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor() { }
}
