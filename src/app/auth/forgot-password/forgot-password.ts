import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { TranslationService } from '../../services/translation.service';
import { EmailService } from '../../services/email.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss']
})
export class ForgotPasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly emailService = inject(EmailService);
  readonly translationService = inject(TranslationService);
  
  email = '';
  isLoading = false;
  isSubmitted = false;
  errorMessage = '';
  emailSent = signal(false);
  emailConfigured = signal(this.emailService.isConfigured());

  get t() {
    return this.translationService.t;
  }

  async submit(): Promise<void> {
    if (!this.email) {
      this.errorMessage = this.translationService.isEnglish() 
        ? 'Please enter your email' 
        : 'Veuillez entrer votre email';
      toast.error(this.errorMessage);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = this.translationService.isEnglish() 
        ? 'Please enter a valid email address' 
        : 'Veuillez entrer une adresse email valide';
      toast.error(this.errorMessage);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Check if user exists
    this.authService.getUserByEmail(this.email).subscribe({
      next: async (user) => {
        if (user) {
          // User exists - try to send email
          if (this.emailService.isConfigured()) {
            const resetToken = this.emailService.generateResetToken();
            const userName = user.firstName || 'User';
            
            const sent = await this.emailService.sendPasswordResetEmail(
              this.email,
              userName,
              resetToken
            );
            
            this.emailSent.set(sent);
            
            if (sent) {
              toast.success(this.translationService.isEnglish()
                ? 'Password reset email sent!'
                : 'Email de réinitialisation envoyé !');
            } else {
              toast.warning(this.translationService.isEnglish()
                ? 'Could not send email. Please check EmailJS configuration.'
                : 'Impossible d\'envoyer l\'email. Vérifiez la configuration EmailJS.');
            }
          }
          
          this.isSubmitted = true;
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.errorMessage = this.translationService.isEnglish()
            ? 'No account found with this email address'
            : 'Aucun compte trouvé avec cette adresse email';
          toast.error(this.errorMessage);
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = this.translationService.isEnglish()
          ? 'No account found with this email address'
          : 'Aucun compte trouvé avec cette adresse email';
        toast.error(this.errorMessage);
      }
    });
  }
}
