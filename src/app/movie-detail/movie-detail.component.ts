import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MoviesApiService } from '../services/movies-api';
import { ReviewService } from '../services/review.service';
import { AuthService } from '../services/auth.service';
import { Movie } from '../models/movie';
import { Review } from '../models/review';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, FormsModule],
  templateUrl: './movie-detail.html',
  styleUrls: ['./movie-detail.scss']
})
export class MovieDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly moviesApi = inject(MoviesApiService);
  private readonly reviewService = inject(ReviewService);
  readonly authService = inject(AuthService);
  
  movie: Movie | null = null;
  loading = true;
  
  reviews = signal<Review[]>([]);
  reviewsLoading = signal(false);
  
  showReviewForm = signal(false);
  editingReview = signal<Review | null>(null);
  userReview = signal<Review | null>(null);
  
  reviewForm = {
    rate: 5,
    text: ''
  };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.moviesApi.getMovieById(+id).subscribe({
        next: (movie) => {
          this.movie = movie;
          this.loading = false;
          this.loadReviews(+id);
        },
        error: () => {
          this.loading = false;
          this.router.navigate(['/']);
        }
      });
    }
  }

  loadReviews(movieId: number) {
    this.reviewsLoading.set(true);
    this.reviewService.getReviewsByMovieId(movieId).subscribe({
      next: (reviews) => {
        this.reviews.set(reviews);
        this.reviewsLoading.set(false);
        this.checkUserReview();
      },
      error: () => {
        this.reviewsLoading.set(false);
      }
    });
  }

  checkUserReview() {
    const user = this.authService.currentUser();
    if (user?.id) {
      const existingReview = this.reviews().find(r => r.user.id === user.id);
      this.userReview.set(existingReview || null);
    }
  }

  openReviewForm() {
    if (!this.authService.isAuthenticated()) {
      toast.error('Please login to leave a review');
      this.router.navigate(['/login']);
      return;
    }
    
    if (this.userReview()) {
      this.editingReview.set(this.userReview());
      this.reviewForm = {
        rate: this.userReview()!.rate,
        text: this.userReview()!.text
      };
    } else {
      this.editingReview.set(null);
      this.reviewForm = { rate: 5, text: '' };
    }
    
    this.showReviewForm.set(true);
  }

  cancelReview() {
    this.showReviewForm.set(false);
    this.editingReview.set(null);
    this.reviewForm = { rate: 5, text: '' };
  }

  submitReview() {
    if (!this.movie || !this.authService.currentUser()?.id) return;
    
    if (!this.reviewForm.text.trim()) {
      toast.error('Please write a review');
      return;
    }

    const user = this.authService.currentUser()!;

    if (this.editingReview()) {
      const existingReview = this.editingReview()!;
      const reviewToUpdate = {
        id: existingReview.id,
        user: { id: user.id },
        movie: { id: this.movie.id },
        rate: this.reviewForm.rate,
        text: this.reviewForm.text,
        reviewDate: existingReview.reviewDate
      };
      
      console.log('Updating review:', JSON.stringify(reviewToUpdate));
      
      this.reviewService.updateReview(existingReview.id!, reviewToUpdate).subscribe({
        next: () => {
          toast.success('Review updated!');
          this.showReviewForm.set(false);
          this.loadReviews(this.movie!.id!);
        },
        error: (err) => {
          console.error('Review update error:', err);
          toast.error(err?.error?.message || 'Failed to update review');
        }
      });
    } else {
      const reviewToAdd = {
        user: { id: user.id },
        movie: { id: this.movie.id },
        rate: this.reviewForm.rate,
        text: this.reviewForm.text,
        reviewDate: new Date().toISOString().split('T')[0]
      };
      
      console.log('Adding review:', JSON.stringify(reviewToAdd));
      console.log('User ID:', user.id);
      console.log('Movie ID:', this.movie.id);
      
      this.reviewService.createReview(reviewToAdd).subscribe({
        next: () => {
          toast.success('Review submitted!');
          this.showReviewForm.set(false);
          this.loadReviews(this.movie!.id!);
        },
        error: (err) => {
          console.error('Review submission error:', err);
          toast.error(err?.error?.message || 'Failed to submit review');
        }
      });
    }
  }

  deleteReview(review: Review) {
    if (confirm('Are you sure you want to delete this review?')) {
      this.reviewService.deleteReview(review.id!).subscribe({
        next: () => {
          toast.success('Review deleted');
          this.loadReviews(this.movie!.id!);
          this.userReview.set(null);
        },
        error: () => toast.error('Failed to delete review')
      });
    }
  }

  isOwnReview(review: Review): boolean {
    const user = this.authService.currentUser();
    return user?.id === review.user.id;
  }

  getStars(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(10 - Math.round(rating)).fill(0);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
