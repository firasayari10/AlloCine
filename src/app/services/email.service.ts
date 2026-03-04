import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';
import { environment } from '../../environments/environment';

export interface EmailData {
  to_email: string;
  to_name: string;
  subject: string;
  message: string;
  reset_link?: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private readonly serviceId = environment.emailjs?.serviceId || '';
  private readonly templateId = environment.emailjs?.templateId || '';
  private readonly publicKey = environment.emailjs?.publicKey || '';

  constructor() {
    // Initialize EmailJS with public key
    if (this.publicKey) {
      emailjs.init(this.publicKey);
    }
  }

  /**
   * Check if EmailJS is properly configured
   */
  isConfigured(): boolean {
    return !!(this.serviceId && this.templateId && this.publicKey);
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string, userName: string, resetToken: string): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('EmailJS is not configured. Please add your EmailJS credentials to environment.ts');
      return false;
    }

    const resetLink = `${window.location.origin}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    const templateParams = {
      to_email: email,
      to_name: userName || 'User',
      subject: 'Password Reset Request - Cinema Collection',
      reset_link: resetLink,
      message: `You requested a password reset. Click the link below to reset your password. This link will expire in 1 hour.`,
    };

    try {
      const response = await emailjs.send(
        this.serviceId,
        this.templateId,
        templateParams
      );
      console.log('Email sent successfully:', response.status);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  /**
   * Send welcome email after registration
   */
  async sendWelcomeEmail(email: string, userName: string): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('EmailJS is not configured');
      return false;
    }

    const templateParams = {
      to_email: email,
      to_name: userName,
      subject: 'Welcome to Cinema Collection!',
      message: `Welcome to Cinema Collection! Your account has been created successfully. Start exploring movies and sharing your reviews!`,
    };

    try {
      const response = await emailjs.send(
        this.serviceId,
        this.templateId,
        templateParams
      );
      console.log('Welcome email sent:', response.status);
      return true;
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return false;
    }
  }

  /**
   * Generate a simple reset token (for demo purposes)
   * In production, this should be generated on the backend
   */
  generateResetToken(): string {
    return btoa(Date.now().toString() + Math.random().toString(36).substring(2));
  }
}
