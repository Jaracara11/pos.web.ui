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
  private _routerSub$ = Subscription.EMPTY;
  isSidebarVisible = true;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.toggleSidebarVisibility();
  }

  ngOnDestroy(): void {
    this._routerSub$.unsubscribe();
  }

  private toggleSidebarVisibility(): void {
    this._routerSub$ = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isSidebarVisible = !event.url.includes('/auth');
      }
    });
  }
}
