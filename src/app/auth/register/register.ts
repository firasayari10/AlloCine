import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { TranslationService } from '../../services/translation.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly translationService = inject(TranslationService);

  get t() {
    return this.translationService.t;
  }

  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  isLoading = false;
  errorMessage = '';
  
  // Password validation signals
  passwordTouched = signal(false);
  confirmTouched = signal(false);

  // Password validation checks
  get hasMinLength(): boolean {
    return this.password.length >= 8;
  }

  get hasUppercase(): boolean {
    return /[A-Z]/.test(this.password);
  }

  get hasNumber(): boolean {
    return /[0-9]/.test(this.password);
  }

  get passwordsMatch(): boolean {
    return this.password === this.confirmPassword && this.confirmPassword.length > 0;
  }

  get isPasswordValid(): boolean {
    return this.hasMinLength && this.hasUppercase && this.hasNumber;
  }

  get passwordStrength(): 'weak' | 'medium' | 'strong' {
    let score = 0;
    if (this.hasMinLength) score++;
    if (this.hasUppercase) score++;
    if (this.hasNumber) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(this.password)) score++;
    
    if (score <= 1) return 'weak';
    if (score <= 2) return 'medium';
    return 'strong';
  }

  onPasswordBlur(): void {
    this.passwordTouched.set(true);
  }

  onConfirmBlur(): void {
    this.confirmTouched.set(true);
  }

  register(): void {
    // Mark all fields as touched
    this.passwordTouched.set(true);
    this.confirmTouched.set(true);

    if (!this.email || !this.password || !this.firstName) {
      this.errorMessage = this.translationService.isEnglish() 
        ? 'Please fill in all required fields' 
        : 'Veuillez remplir tous les champs obligatoires';
      toast.error(this.errorMessage);
      return;
    }

    if (!this.hasMinLength) {
      this.errorMessage = this.translationService.isEnglish()
        ? 'Password must be at least 8 characters'
        : 'Le mot de passe doit contenir au moins 8 caractères';
      toast.error(this.errorMessage);
      return;
    }

    if (!this.hasUppercase) {
      this.errorMessage = this.translationService.isEnglish()
        ? 'Password must contain at least one uppercase letter'
        : 'Le mot de passe doit contenir au moins une majuscule';
      toast.error(this.errorMessage);
      return;
    }

    if (!this.hasNumber) {
      this.errorMessage = this.translationService.isEnglish()
        ? 'Password must contain at least one number'
        : 'Le mot de passe doit contenir au moins un chiffre';
      toast.error(this.errorMessage);
      return;
    }

    if (!this.passwordsMatch) {
      this.errorMessage = this.translationService.isEnglish()
        ? 'Passwords do not match'
        : 'Les mots de passe ne correspondent pas';
      toast.error(this.errorMessage);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register({
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName
    }).subscribe({
      next: () => {
        this.isLoading = false;
        toast.success(this.translationService.isEnglish() 
          ? 'Account created successfully!' 
          : 'Compte créé avec succès !');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 409 || err.error?.message?.includes('exist')) {
          this.errorMessage = this.translationService.isEnglish() 
            ? 'Email already registered' 
            : 'Email déjà enregistré';
          toast.error(this.errorMessage);
        } else {
          this.errorMessage = this.translationService.isEnglish()
            ? 'Registration failed. Please try again.'
            : 'Inscription échouée. Veuillez réessayer.';
          toast.error(this.errorMessage);
        }
      }
    });
  }
}
