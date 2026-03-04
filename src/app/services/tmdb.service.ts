import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TmdbResponse, TmdbMovieDetails } from '../models/tmdb-movie';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TmdbService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = environment.tmdbBaseUrl;
  private readonly imageUrl = environment.tmdbImageUrl;

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${environment.tmdbReadToken}`,
      'Content-Type': 'application/json'
    });
  }

  getPopularMovies(page: number = 1): Observable<TmdbResponse> {
    return this.httpClient.get<TmdbResponse>(
      `${this.baseUrl}/movie/popular?language=en-US&page=${page}`,
      { headers: this.getHeaders() }
    );
  }

  getTopRatedMovies(page: number = 1): Observable<TmdbResponse> {
    return this.httpClient.get<TmdbResponse>(
      `${this.baseUrl}/movie/top_rated?language=en-US&page=${page}`,
      { headers: this.getHeaders() }
    );
  }

  getNowPlayingMovies(page: number = 1): Observable<TmdbResponse> {
    return this.httpClient.get<TmdbResponse>(
      `${this.baseUrl}/movie/now_playing?language=en-US&page=${page}`,
      { headers: this.getHeaders() }
    );
  }

  getUpcomingMovies(page: number = 1): Observable<TmdbResponse> {
    return this.httpClient.get<TmdbResponse>(
      `${this.baseUrl}/movie/upcoming?language=en-US&page=${page}`,
      { headers: this.getHeaders() }
    );
  }

  searchMovies(query: string, page: number = 1): Observable<TmdbResponse> {
    return this.httpClient.get<TmdbResponse>(
      `${this.baseUrl}/search/movie?language=en-US&query=${encodeURIComponent(query)}&page=${page}`,
      { headers: this.getHeaders() }
    );
  }

  getMovieDetails(id: number): Observable<TmdbMovieDetails> {
    return this.httpClient.get<TmdbMovieDetails>(
      `${this.baseUrl}/movie/${id}?language=en-US&append_to_response=credits`,
      { headers: this.getHeaders() }
    );
  }

  getPosterUrl(posterPath: string | null): string {
    if (!posterPath) return '';
    return `${this.imageUrl}${posterPath}`;
  }

  getBackdropUrl(backdropPath: string | null): string {
    if (!backdropPath) return '';
    return `https://image.tmdb.org/t/p/original${backdropPath}`;
  }
}
