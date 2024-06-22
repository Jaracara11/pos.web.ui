import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './core/components/sidebar/sidebar.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private _routerSubscription: Subscription;
  isSidebarVisible = true;

  constructor(private router: Router) {
    this._routerSubscription = Subscription.EMPTY;
  }

  ngOnInit(): void {
    this.toggleSidebarVisibility();
  }

  ngOnDestroy(): void {
    this._routerSubscription.unsubscribe();
  }

  private toggleSidebarVisibility(): void {
    this._routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isSidebarVisible = !event.url.includes('/auth');
      }
    });
  }
}
