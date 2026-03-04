import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { User } from '../models/user';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfileComponent implements OnInit {
  private readonly authService = inject(AuthService);
  readonly themeService = inject(ThemeService);

  activeTab = signal<'profile' | 'settings'>('profile');
  isEditing = signal(false);
  isLoading = signal(false);

  editForm = {
    firstName: '',
    lastName: '',
    email: ''
  };

  settings = {
    notifications: true,
    autoPlay: false
  };

  ngOnInit(): void {
    this.loadSettings();
    this.resetForm();
  }

  get user() {
    return this.authService.currentUser();
  }

  resetForm(): void {
    const user = this.user;
    if (user) {
      this.editForm = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email
      };
    }
  }

  startEditing(): void {
    this.resetForm();
    this.isEditing.set(true);
  }

  cancelEditing(): void {
    this.resetForm();
    this.isEditing.set(false);
  }

  saveProfile(): void {
    if (!this.editForm.email || !this.editForm.firstName) {
      toast.error('Email and first name are required');
      return;
    }

    this.isLoading.set(true);

    const updatedUser: User = {
      ...this.user!,
      firstName: this.editForm.firstName,
      lastName: this.editForm.lastName,
      email: this.editForm.email
    };

    this.authService.updateUser(updatedUser).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isEditing.set(false);
        toast.success('Profile updated successfully!');
      },
      error: () => {
        this.isLoading.set(false);
        toast.error('Failed to update profile');
      }
    });
  }

  loadSettings(): void {
    const saved = localStorage.getItem('userSettings');
    if (saved) {
      this.settings = { ...this.settings, ...JSON.parse(saved) };
    }
  }

  saveSettings(): void {
    localStorage.setItem('userSettings', JSON.stringify(this.settings));
    toast.success('Settings saved!');
  }

  toggleDarkMode(): void {
    this.themeService.toggleTheme();
  }

  toggleSetting(key: 'notifications' | 'autoPlay'): void {
    this.settings[key] = !this.settings[key];
    this.saveSettings();
  }

  getInitials(): string {
    const user = this.user;
    if (!user) return '?';
    const first = user.firstName?.charAt(0) || '';
    const last = user.lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || user.email.charAt(0).toUpperCase();
  }

  getMemberSince(): string {
    const user = this.user;
    if (!user?.createdAt) return 'Recently';
    return new Date(user.createdAt).toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  }
}
