import { Component, Input, Output, EventEmitter, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class Sidebar {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() categorySelect = new EventEmitter<string>();

  readonly authService = inject(AuthService);
  readonly translationService = inject(TranslationService);
  private readonly router = inject(Router);

  get t() {
    return this.translationService.t;
  }

  navItems = computed(() => [
    { label: this.t.home, route: '/', exact: true },
    { label: this.t.movies, route: '/movies', exact: false },
    { label: this.t.myReviews, route: '/my-reviews', exact: false, requiresAuth: true },
    { label: this.t.addMovie, route: '/add-movie', exact: false, requiresAuth: true },
  ]);

  closeSidebar() {
    this.close.emit();
  }

  onBackdropClick(event: Event) {
    if ((event.target as HTMLElement).classList.contains('sidebar-backdrop')) {
      this.closeSidebar();
    }
  }

  navigateToCategory(category: string) {
    this.closeSidebar();
    this.categorySelect.emit(category);
    
    this.router.navigate(['/'], { queryParams: { category } }).then(() => {
      setTimeout(() => {
        const element = document.getElementById('explore-section');
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });
  }
}
