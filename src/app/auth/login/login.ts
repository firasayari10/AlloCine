import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  login(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (user) => {
        this.isLoading = false;
        if (user) {
          toast.success('Welcome back!');
          this.router.navigate(['/']);
        } else {
          this.errorMessage = 'Invalid email or password';
          toast.error('Invalid credentials');
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Login failed. Please try again.';
        toast.error('Login failed');
      }
    });
  }
}
