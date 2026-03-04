import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-navbar',
  standalone: true,           
  imports: [CommonModule, RouterLink, RouterLinkActive, TitleCasePipe],    
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'], 
})
export class Navbar {
  @Input({ required: true }) title!: string;
  @Output() menuToggle = new EventEmitter<void>();
  
  readonly authService = inject(AuthService);

  toggleMenu() {
    this.menuToggle.emit();
  }

  logout() {
    this.authService.logout();
    toast.success('Logged out successfully');
  }

  getInitials(): string {
    const user = this.authService.currentUser();
    if (!user) return '?';
    const first = user.firstName?.charAt(0) || '';
    const last = user.lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || user.email.charAt(0).toUpperCase();
  }
}
