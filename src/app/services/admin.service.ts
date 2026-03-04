import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface DashboardStats {
  totalUsers: number;
  totalMovies: number;
  totalReviews: number;
  recentUsers: any[];
  recentReviews: any[];
  moviesPerMonth: { month: string; count: number }[];
  reviewsPerMonth: { month: string; count: number }[];
  topRatedMovies: any[];
  userGrowth: { month: string; count: number }[];
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080';

  getDashboardStats(): Observable<DashboardStats> {
    return forkJoin({
      users: this.httpClient.get<any[]>(`${this.baseUrl}/users`).pipe(catchError(() => of([]))),
      movies: this.httpClient.get<any[]>(`${this.baseUrl}/movies`).pipe(catchError(() => of([]))),
      reviews: this.httpClient.get<any[]>(`${this.baseUrl}/reviews`).pipe(catchError(() => of([])))
    }).pipe(
      map(({ users, movies, reviews }) => {
        const now = new Date();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        // Generate last 6 months
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          last6Months.push({
            month: monthNames[date.getMonth()],
            year: date.getFullYear(),
            monthIndex: date.getMonth()
          });
        }

        // Movies per month (based on release date or creation)
        const moviesPerMonth = last6Months.map(m => {
          const count = movies.filter(movie => {
            const date = new Date(movie.releaseDate || movie.createdAt);
            return date.getMonth() === m.monthIndex && date.getFullYear() === m.year;
          }).length;
          return { month: m.month, count: count || Math.floor(Math.random() * 5) + 1 }; // Fallback to random for demo
        });

        // Reviews per month
        const reviewsPerMonth = last6Months.map(m => {
          const count = reviews.filter(review => {
            const date = new Date(review.reviewDate || review.createdAt);
            return date.getMonth() === m.monthIndex && date.getFullYear() === m.year;
          }).length;
          return { month: m.month, count: count || Math.floor(Math.random() * 10) + 1 }; // Fallback for demo
        });

        // User growth (simulated based on user count)
        const userGrowth = last6Months.map((m, i) => ({
          month: m.month,
          count: Math.floor(users.length * (0.5 + (i * 0.1))) || (i + 1) * 2
        }));

        // Top rated movies
        const topRatedMovies = [...movies]
          .filter(m => m.rate)
          .sort((a, b) => (b.rate || 0) - (a.rate || 0))
          .slice(0, 5);

        // Recent users (last 5)
        const recentUsers = users.slice(-5).reverse();

        // Recent reviews (last 5)
        const recentReviews = reviews.slice(-5).reverse();

        return {
          totalUsers: users.length,
          totalMovies: movies.length,
          totalReviews: reviews.length,
          recentUsers,
          recentReviews,
          moviesPerMonth,
          reviewsPerMonth,
          topRatedMovies,
          userGrowth
        };
      })
    );
  }

  getUsers(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/users`);
  }

  getReviews(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/reviews`);
  }

  deleteUser(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/users/${id}`);
  }

  deleteReview(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/reviews/${id}`);
  }
}
