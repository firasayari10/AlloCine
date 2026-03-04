import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { TranslationService } from '../../services/translation.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.scss']
})
export class ResetPasswordComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly translationService = inject(TranslationService);

  email = '';
  token = '';
  newPassword = '';
  confirmPassword = '';
  isLoading = false;
  isSuccess = false;
  errorMessage = '';
  isValidToken = signal(false);
  isCheckingToken = signal(true);

  // Password validation
  passwordTouched = signal(false);
  confirmTouched = signal(false);

  get t() {
    return this.translationService.t;
  }

  get hasMinLength(): boolean {
    return this.newPassword.length >= 8;
  }

  get hasUppercase(): boolean {
    return /[A-Z]/.test(this.newPassword);
  }

  get hasNumber(): boolean {
    return /[0-9]/.test(this.newPassword);
  }

  get passwordsMatch(): boolean {
    return this.newPassword === this.confirmPassword && this.confirmPassword.length > 0;
  }

  get isPasswordValid(): boolean {
    return this.hasMinLength && this.hasUppercase && this.hasNumber;
  }

  get passwordStrength(): 'weak' | 'medium' | 'strong' {
    let score = 0;
    if (this.hasMinLength) score++;
    if (this.hasUppercase) score++;
    if (this.hasNumber) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(this.newPassword)) score++;
    
    if (score <= 1) return 'weak';
    if (score <= 2) return 'medium';
    return 'strong';
  }

  ngOnInit(): void {
    // Get token and email from URL params
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      this.email = params['email'] || '';
      
      if (this.token && this.email) {
        this.validateToken();
      } else {
        this.isCheckingToken.set(false);
        this.isValidToken.set(false);
      }
    });
  }

  private validateToken(): void {
    // Decode and check token expiration (token contains timestamp)
    try {
      const decoded = atob(this.token);
      const timestamp = parseInt(decoded.split(/[^0-9]/)[0]);
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      
      if (timestamp > oneHourAgo) {
        // Token is valid (less than 1 hour old)
        this.isValidToken.set(true);
      } else {
        this.isValidToken.set(false);
        this.errorMessage = this.translationService.isEnglish()
          ? 'This reset link has expired. Please request a new one.'
          : 'Ce lien de réinitialisation a expiré. Veuillez en demander un nouveau.';
      }
    } catch {
      this.isValidToken.set(false);
      this.errorMessage = this.translationService.isEnglish()
        ? 'Invalid reset link. Please request a new one.'
        : 'Lien de réinitialisation invalide. Veuillez en demander un nouveau.';
    }
    
    this.isCheckingToken.set(false);
  }

  onPasswordBlur(): void {
    this.passwordTouched.set(true);
  }

  onConfirmBlur(): void {
    this.confirmTouched.set(true);
  }

  resetPassword(): void {
    this.passwordTouched.set(true);
    this.confirmTouched.set(true);

    if (!this.isPasswordValid) {
      this.errorMessage = this.translationService.isEnglish()
        ? 'Please meet all password requirements'
        : 'Veuillez respecter toutes les exigences du mot de passe';
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

    // Get user by email and update password
    this.authService.getUserByEmail(this.email).subscribe({
      next: (user) => {
        if (user) {
          // Update user with new password
          const updatedUser = { ...user, password: this.newPassword };
          this.authService.updateUserPassword(user.id!, this.newPassword).subscribe({
            next: () => {
              this.isLoading = false;
              this.isSuccess = true;
              toast.success(this.translationService.isEnglish()
                ? 'Password reset successfully!'
                : 'Mot de passe réinitialisé avec succès !');
            },
            error: () => {
              this.isLoading = false;
              this.errorMessage = this.translationService.isEnglish()
                ? 'Failed to reset password. Please try again.'
                : 'Échec de la réinitialisation. Veuillez réessayer.';
              toast.error(this.errorMessage);
            }
          });
        } else {
          this.isLoading = false;
          this.errorMessage = this.translationService.isEnglish()
            ? 'User not found'
            : 'Utilisateur non trouvé';
          toast.error(this.errorMessage);
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = this.translationService.isEnglish()
          ? 'An error occurred. Please try again.'
          : 'Une erreur est survenue. Veuillez réessayer.';
        toast.error(this.errorMessage);
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
