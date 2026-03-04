import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, ChildrenOutletContexts } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { Sidebar } from './sidebar/sidebar';
import { FooterComponent } from './footer/footer';
import { routeAnimations } from './route-animations';
import { NgxSonnerToaster } from 'ngx-sonner';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Sidebar, FooterComponent, NgxSonnerToaster],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  animations: [routeAnimations]
})
export class App {
  title = signal('Allocine');
  sidebarOpen = signal(false);

  private readonly themeService = inject(ThemeService);

  constructor(private contexts: ChildrenOutletContexts) {}

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.url;
  }

  toggleSidebar() {
    this.sidebarOpen.update(open => !open);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }
}
