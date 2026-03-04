import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReviewService } from '../services/review.service';
import { AuthService } from '../services/auth.service';
import { TranslationService } from '../services/translation.service';
import { Review } from '../models/review';
import { Movie } from '../models/movie';

@Component({
  selector: 'app-my-reviews',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './my-reviews.html',
  styleUrls: ['./my-reviews.scss']
})
export class MyReviewsComponent implements OnInit {
  private readonly reviewService = inject(ReviewService);
  private readonly authService = inject(AuthService);
  readonly translationService = inject(TranslationService);

  get t() {
    return this.translationService.t;
  }

  reviews = signal<Review[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.loadReviews();
  }

  loadReviews() {
    const user = this.authService.currentUser();
    if (user?.id) {
      // Fetch all reviews and filter by current user
      this.reviewService.getReviews().subscribe({
        next: (reviews) => {
          // Normalize: backend might use 'film' instead of 'movie'
          const normalizedReviews = reviews.map(r => ({
            ...r,
            movie: r.movie || r.film
          }));
          const userReviews = normalizedReviews.filter(r => r.user.id === user.id);
          console.log('All reviews:', reviews);
          console.log('User reviews:', userReviews);
          this.reviews.set(userReviews);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error loading reviews:', err);
          this.loading.set(false);
        }
      });
    } else {
      this.loading.set(false);
    }
  }

  getMovie(review: Review): Movie | undefined {
    return review.movie || review.film;
  }

  getMovieImage(review: Review): string {
    const movie = this.getMovie(review);
    if (!movie) return '';
    if (movie.image?.startsWith('http')) {
      return movie.image;
    }
    if (movie.id) {
      return `http://localhost:8080/movies/${movie.id}/image`;
    }
    return '';
  }

  getStars(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(10 - Math.round(rating)).fill(0);
  }
}
