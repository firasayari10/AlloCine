import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe, DatePipe } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MoviesApiService } from '../services/movies-api';
import { TmdbService } from '../services/tmdb.service';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie';
import { TmdbMovie } from '../models/tmdb-movie';
import { MovieCard } from './movie-card/movie-card';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-home',
  standalone: true,             
  imports: [CommonModule, AsyncPipe, DatePipe, MovieCard, RouterModule, FormsModule], 
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit {
  private readonly moviesApi = inject(MoviesApiService);
  private readonly tmdbService = inject(TmdbService);
  private readonly route = inject(ActivatedRoute);
  
  movies$: Observable<Movie[]> = this.moviesApi.getMovies();
  
  tmdbMovies = signal<TmdbMovie[]>([]);
  tmdbCategory = signal<'popular' | 'top_rated' | 'now_playing' | 'upcoming'>('popular');
  tmdbSearchQuery = signal('');
  tmdbLoading = signal(false);
  addingMovieId = signal<number | null>(null);
  addedMovieIds = signal<Set<number>>(new Set());

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const category = params['category'];
      if (category && ['popular', 'top_rated', 'now_playing', 'upcoming'].includes(category)) {
        this.tmdbCategory.set(category as 'popular' | 'top_rated' | 'now_playing' | 'upcoming');
        this.loadTmdbMovies();
      }
    });
    
    this.loadTmdbMovies();
  }

  scrollToMovies() {
    const element = document.getElementById('movies-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToExplore() {
    const element = document.getElementById('explore-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  }

  loadTmdbMovies() {
    this.tmdbLoading.set(true);
    
    let request$;
    switch (this.tmdbCategory()) {
      case 'top_rated':
        request$ = this.tmdbService.getTopRatedMovies();
        break;
      case 'now_playing':
        request$ = this.tmdbService.getNowPlayingMovies();
        break;
      case 'upcoming':
        request$ = this.tmdbService.getUpcomingMovies();
        break;
      default:
        request$ = this.tmdbService.getPopularMovies();
    }

    request$.subscribe({
      next: (response) => {
        this.tmdbMovies.set(response.results);
        this.tmdbLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load TMDB movies:', err);
        this.tmdbLoading.set(false);
      }
    });
  }

  searchTmdbMovies() {
    const query = this.tmdbSearchQuery().trim();
    if (!query) {
      this.loadTmdbMovies();
      return;
    }

    this.tmdbLoading.set(true);
    this.tmdbService.searchMovies(query).subscribe({
      next: (response) => {
        this.tmdbMovies.set(response.results);
        this.tmdbLoading.set(false);
      },
      error: (err) => {
        console.error('Search failed:', err);
        this.tmdbLoading.set(false);
      }
    });
  }

  changeCategory(category: 'popular' | 'top_rated' | 'now_playing' | 'upcoming') {
    this.tmdbCategory.set(category);
    this.tmdbSearchQuery.set('');
    this.loadTmdbMovies();
  }

  getPosterUrl(posterPath: string | null): string {
    return this.tmdbService.getPosterUrl(posterPath);
  }

  addToCollection(tmdbMovie: TmdbMovie) {
    this.addingMovieId.set(tmdbMovie.id);

    this.tmdbService.getMovieDetails(tmdbMovie.id).subscribe({
      next: (details) => {
        const director = details.credits?.crew.find(c => c.job === 'Director')?.name || '';
        
        const movie: Movie = {
          title: tmdbMovie.title,
          director: director,
          releaseDate: new Date(tmdbMovie.release_date),
          synopsis: tmdbMovie.overview,
          rate: Math.round(tmdbMovie.vote_average * 10) / 10,
          image: tmdbMovie.poster_path ? this.getPosterUrl(tmdbMovie.poster_path) : undefined
        };

        this.moviesApi.addMovie(movie).subscribe({
          next: () => {
            this.addingMovieId.set(null);
            this.addedMovieIds.update(set => new Set([...set, tmdbMovie.id]));
            this.movies$ = this.moviesApi.getMovies();
            toast.success(`"${tmdbMovie.title}" added to collection!`);
          },
          error: (err) => {
            console.error('Failed to add movie:', err);
            this.addingMovieId.set(null);
            toast.error('Failed to add movie');
          }
        });
      },
      error: (err) => {
        console.error('Failed to get movie details:', err);
        this.addingMovieId.set(null);
      }
    });
  }

  isMovieAdded(movieId: number): boolean {
    return this.addedMovieIds().has(movieId);
  }

  isAddingMovie(movieId: number): boolean {
    return this.addingMovieId() === movieId;
  }
}
