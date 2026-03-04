import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review, CreateReviewRequest, CheckReviewDTO } from '../models/review';

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

  createReview(review: any): Observable<Review> {
    return this.httpClient.post<Review>(this.url, review);
  }

  updateReview(id: number, review: any): Observable<Review> {
    return this.httpClient.put<Review>(`${this.url}/${id}`, review);
  }

  deleteReview(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${id}`);
  }

  checkUserReview(userId: number, filmId: number): Observable<Review | null> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('filmId', filmId.toString());
    return this.httpClient.get<Review | null>(`${this.url}/checkAvis`, { params });
  }

  getReviewsByYear(year: number): Observable<Review[]> {
    return this.httpClient.get<Review[]>(`${this.url}/byYear/${year}`);
  }

  getReviewsQuantityByYear(year: number): Observable<number> {
    return this.httpClient.get<number>(`${this.url}/byYear/${year}/quantity`);
  }

  getAllYears(): Observable<number[]> {
    return this.httpClient.get<number[]>(`${this.url}/findAllYears`);
  }
}
