import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss']
})
export class ForgotPasswordComponent {
  email = '';
  isLoading = false;
  isSubmitted = false;
  errorMessage = '';

  submit(): void {
    if (!this.email) {
      this.errorMessage = 'Please enter your email';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    setTimeout(() => {
      this.isLoading = false;
      this.isSubmitted = true;
      toast.success('If an account exists, reset instructions will be sent!');
    }, 1000);
  }
}
