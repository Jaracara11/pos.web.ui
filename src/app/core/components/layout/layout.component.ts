import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit, OnDestroy {
  private _routerSub$: Subscription;;
  private hiddenSidebarRoute = '/auth';
  isSidebarVisible: boolean;

  constructor(private router: Router) {
    this._routerSub$ = Subscription.EMPTY;
    this.isSidebarVisible = this.router.url !== this.hiddenSidebarRoute;
  }

  ngOnInit(): void {
    this.toggleSidebarVisibility();
  }

  ngOnDestroy(): void {
    this._routerSub$.unsubscribe();
  }

  private toggleSidebarVisibility(): void {
    this._routerSub$ = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isSidebarVisible = event.url !== this.hiddenSidebarRoute;
      }
    });
  }
}