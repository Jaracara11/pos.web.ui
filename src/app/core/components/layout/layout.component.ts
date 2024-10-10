import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  isSidebarVisible = true;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.toggleSidebarVisibility();
  }

  private toggleSidebarVisibility(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isSidebarVisible = !event.url.includes('/auth');
      }
    });
  }
}
