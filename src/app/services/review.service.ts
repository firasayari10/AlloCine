import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private readonly httpClient = inject(HttpClient);
  private readonly url = 'http://localhost:8080/reviews';
  private readonly moviesUrl = 'http://localhost:8080/movies';

  getReviews(): Observable<Review[]> {
    return this.httpClient.get<Review[]>(this.url);
  }

  getReviewById(id: number): Observable<Review> {
    return this.httpClient.get<Review>(`${this.url}/${id}`);
  }

  getReviewsByMovieId(movieId: number): Observable<Review[]> {
    return this.httpClient.get<Review[]>(`${this.moviesUrl}/${movieId}/reviews`);
  }

  getReviewsByUserId(userId: number): Observable<Review[]> {
    return this.httpClient.get<Review[]>(`${this.moviesUrl}/byReviewer/${userId}`);
  }

  createReview(review: any): Observable<Review> {
    return this.httpClient.post<Review>(this.url, review);
  }

  updateReview(id: number, review: any): Observable<Review> {
    return this.httpClient.put<Review>(`${this.url}/${id}`, review);
  }

  deleteReview(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${id}`);
  }
}
