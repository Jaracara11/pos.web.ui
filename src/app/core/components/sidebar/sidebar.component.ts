import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
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
